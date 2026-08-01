import {
  createPersonalTask,
  updatePersonalTask,
} from "../services/personalTaskRepository";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "../auth/AuthContext";
import {
  pullStudySnapshot,
  pushStudySnapshot,
} from "../services/cloud/studySync";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { readStorage, writeStorage, STORAGE_KEYS } from "../utils/storage";
import { buildTasksForLecture, deriveTaskStatus } from "../utils/revisionGenerator";
import { DEFAULT_SETTINGS } from "../data/defaultSettings";
import { computeStreaks } from "../utils/streakHelpers";
import {
  createLocalSubjectRepository,
  createSubject,
  hydrateSubjectData,
  subjectNameKey,
} from "../services/subjectRepository";
import {
  createHabit,
  createHabitLog,
  createLocalHabitRepository,
  habitNameKey,
} from "../services/habitRepository";
import { getHabitAnalytics, isHabitScheduledOn } from "../utils/habitAnalytics";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user, accessToken } = useAuth();
  const [cloudLoaded, setCloudLoaded] = useState(false);
  const uploadTimeoutRef = useRef(null);
  const hasLoadedCloudRef = useRef(false);
  const [initialData] = useState(() => {
    const subjectRepository = createLocalSubjectRepository({
      read: readStorage,
      write: writeStorage,
      key: STORAGE_KEYS.subjects,
    });
    return hydrateSubjectData({
      subjects: subjectRepository.list(),
      lectures: readStorage(STORAGE_KEYS.lectures, []),
      tasks: readStorage(STORAGE_KEYS.tasks, []),
    });
  });
  const [subjects, setSubjects] = useState(initialData.subjects);
const [lectures, setLectures] = useState(initialData.lectures);
const [tasks, setTasks] = useState(initialData.tasks);

const [personalTasks, setPersonalTasks] = useState(() =>
  readStorage(STORAGE_KEYS.personalTasks, [])
);

const [settings, setSettings] = useState(() =>
  readStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
);
  const [habitData] = useState(() => {
    const habitRepository = createLocalHabitRepository({
      read: readStorage,
      write: writeStorage,
      habitsKey: STORAGE_KEYS.habits,
      logsKey: STORAGE_KEYS.habitLogs,
    });
    return { habits: habitRepository.listHabits(), logs: habitRepository.listLogs() };
  });
  const [habits, setHabits] = useState(() => (
    Array.isArray(habitData.habits) ? habitData.habits.sort((a, b) => a.sortOrder - b.sortOrder) : []
  ));
  const [habitLogs, setHabitLogs] = useState(() => (
    Array.isArray(habitData.logs) ? habitData.logs : []
  ));

  // Persist to localStorage whenever state changes.
  useEffect(() => {
    writeStorage(STORAGE_KEYS.lectures, lectures);
  }, [lectures]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.tasks, tasks);
  }, [tasks]);
  useEffect(() => {
    const subjectRepository = createLocalSubjectRepository({
      read: readStorage,
      write: writeStorage,
      key: STORAGE_KEYS.subjects,
    });
    subjectRepository.save(subjects);
  }, [subjects]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);
  useEffect(() => {
    const habitRepository = createLocalHabitRepository({
      read: readStorage,
      write: writeStorage,
      habitsKey: STORAGE_KEYS.habits,
      logsKey: STORAGE_KEYS.habitLogs,
    });
    habitRepository.saveHabits(habits);
  }, [habits]);
  useEffect(() => {
    const habitRepository = createLocalHabitRepository({
      read: readStorage,
      write: writeStorage,
      habitsKey: STORAGE_KEYS.habits,
      logsKey: STORAGE_KEYS.habitLogs,
    });
    habitRepository.saveLogs(habitLogs);
  }, [habitLogs]);



  // Live status (pending/overdue/completed) is derived every render off
  // the raw stored data, never stored directly, so it can't go stale.
  const liveTasks = useMemo(
    () => tasks.map((t) => ({ ...t, status: deriveTaskStatus(t) })),
    [tasks]
  );

  const addLecture = useCallback(
    (lectureInput) => {
      const subject = subjects.find((item) => item.id === lectureInput.subjectId);
      if (!subject) throw new Error("Choose an existing subject before saving a lecture.");

      const lecture = {
        id: uuidv4(),
        subjectId: subject.id,
        // This denormalised name is retained for old local data and fast task
        // rendering; it is synchronised whenever the subject is renamed.
        subject: subject.name,
        lectureName: lectureInput.lectureName || "Untitled Lecture",
        course: lectureInput.course || "",
        faculty: lectureInput.faculty || "",
        completedDate: lectureInput.completedDate,
        difficulty: lectureInput.difficulty || "Medium",
        priority: lectureInput.priority || "Medium",
        notes: lectureInput.notes || "",
        createdAt: dayjs().toISOString(),
        updatedAt: dayjs().toISOString(),
      };

      const newTasks = buildTasksForLecture(lecture, settings.intervals);

      setLectures((prev) => [lecture, ...prev]);
      setTasks((prev) => [...newTasks, ...prev]);

      return lecture;
    },
    [settings.intervals, subjects]
  );

  const addSubject = useCallback((input) => {
    const name = String(input?.name || "").trim();
    if (subjects.some((subject) => subjectNameKey(subject.name) === subjectNameKey(name))) {
      throw new Error("A subject with that name already exists.");
    }
    const newSubject = createSubject({ ...input, name, sortOrder: subjects.length });
    setSubjects((prev) => [...prev, newSubject]);
    return newSubject;
  }, [subjects]);

  const updateSubject = useCallback((subjectId, patch) => {
    const current = subjects.find((subject) => subject.id === subjectId);
    if (!current) throw new Error("That subject no longer exists.");

    const nextName = String(patch?.name ?? current.name).trim();
    if (!nextName) throw new Error("A subject name is required.");
    if (subjects.some((subject) => subject.id !== subjectId && subjectNameKey(subject.name) === subjectNameKey(nextName))) {
      throw new Error("A subject with that name already exists.");
    }

    const updatedSubject = {
      ...current,
      ...patch,
      name: nextName,
      color: patch?.color || current.color,
      updatedAt: dayjs().toISOString(),
    };

    setSubjects((prev) => prev.map((subject) => (subject.id === subjectId ? updatedSubject : subject)));
    setLectures((prev) => prev.map((lecture) => (
      lecture.subjectId === subjectId ? { ...lecture, subject: updatedSubject.name } : lecture
    )));
    setTasks((prev) => prev.map((task) => (
      task.subjectId === subjectId ? { ...task, subject: updatedSubject.name } : task
    )));
    return updatedSubject;
  }, [subjects]);

  const deleteSubject = useCallback((subjectId) => {
    setSubjects((prev) => prev.filter((subject) => subject.id !== subjectId).map((subject, index) => ({
      ...subject,
      sortOrder: index,
      updatedAt: dayjs().toISOString(),
    })));
    setLectures((prev) => prev.filter((lecture) => lecture.subjectId !== subjectId));
    setTasks((prev) => prev.filter((task) => task.subjectId !== subjectId));
  }, []);

  const reorderSubjects = useCallback((orderedIds) => {
    const order = new Map(orderedIds.map((id, index) => [id, index]));
    setSubjects((prev) => [...prev]
      .sort((a, b) => (order.get(a.id) ?? a.sortOrder) - (order.get(b.id) ?? b.sortOrder))
      .map((subject, index) => ({ ...subject, sortOrder: index, updatedAt: dayjs().toISOString() })));
  }, []);

  const addHabit = useCallback((input) => {
    const name = String(input?.name || "").trim();
    if (habits.some((habit) => habitNameKey(habit.name) === habitNameKey(name))) {
      throw new Error("A habit with that name already exists.");
    }
    const newHabit = createHabit({ ...input, name, sortOrder: habits.length });
    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  }, [habits]);

  const updateHabit = useCallback((habitId, patch) => {
    const current = habits.find((habit) => habit.id === habitId);
    if (!current) throw new Error("That habit no longer exists.");
    const nextName = String(patch?.name ?? current.name).trim();
    if (!nextName) throw new Error("A habit name is required.");
    if (habits.some((habit) => habit.id !== habitId && habitNameKey(habit.name) === habitNameKey(nextName))) {
      throw new Error("A habit with that name already exists.");
    }
    const updatedHabit = {
      ...current,
      ...patch,
      name: nextName,
      color: patch?.color || current.color,
      updatedAt: dayjs().toISOString(),
    };
    setHabits((prev) => prev.map((habit) => (habit.id === habitId ? updatedHabit : habit)));
    return updatedHabit;
  }, [habits]);

  const deleteHabit = useCallback((habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId).map((habit, index) => ({
      ...habit,
      sortOrder: index,
      updatedAt: dayjs().toISOString(),
    })));
    setHabitLogs((prev) => prev.filter((log) => log.habitId !== habitId));
  }, []);

  const reorderHabits = useCallback((orderedIds) => {
    const order = new Map(orderedIds.map((id, index) => [id, index]));
    setHabits((prev) => [...prev]
      .sort((a, b) => (order.get(a.id) ?? a.sortOrder) - (order.get(b.id) ?? b.sortOrder))
      .map((habit, index) => ({ ...habit, sortOrder: index, updatedAt: dayjs().toISOString() })));
  }, []);

  const toggleHabitLog = useCallback((habitId, date) => {
    const habit = habits.find((item) => item.id === habitId);
    if (!habit || !isHabitScheduledOn(habit, date)) return;
    setHabitLogs((prev) => {
      const existing = prev.find((log) => log.habitId === habitId && log.date === date);
      if (existing?.completed) return prev.filter((log) => log.id !== existing.id);
      if (existing) {
        return prev.map((log) => (log.id === existing.id ? {
          ...log,
          completed: true,
          updatedAt: dayjs().toISOString(),
        } : log));
      }
      return [...prev, createHabitLog({ habitId, date })];
    });
  }, [habits]);

  const deleteLecture = useCallback((lectureId) => {
    setLectures((prev) => prev.filter((l) => l.id !== lectureId));
    setTasks((prev) => prev.filter((t) => t.lectureId !== lectureId));
  }, []);

  const toggleTask = useCallback((taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const completed = !t.completed;
        return {
          ...t,
          completed,
          completedAt: completed ? dayjs().toISOString() : null,
          status: completed ? "completed" : deriveTaskStatus({ ...t, completed: false }),
          updatedAt: dayjs().toISOString(),
        };
      })
    );
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const addPersonalTask = useCallback((input) => {
  const task = createPersonalTask(input);
  setPersonalTasks((prev) => [task, ...prev]);
  return task;
}, []);

const editPersonalTask = useCallback((taskId, updates) => {
  setPersonalTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? updatePersonalTask(task, updates)
        : task
    )
  );
}, []);

const deletePersonalTask = useCallback((taskId) => {
  setPersonalTasks((prev) =>
    prev.filter((task) => task.id !== taskId)
  );
}, []);

const togglePersonalTask = useCallback((taskId) => {
  setPersonalTasks((prev) =>
    prev.map((task) =>
      task.id === taskId
        ? updatePersonalTask(task, {
            completed: !task.completed,
          })
        : task
    )
  );
}, []);

  const replaceAllData = useCallback((snapshot) => {
  setSubjects(snapshot.subjects ?? []);
  setLectures(snapshot.lectures ?? []);
  setTasks(snapshot.tasks ?? []);
  setPersonalTasks(snapshot.personalTasks ?? []);
  setHabits(snapshot.habits ?? []);
  setHabitLogs(snapshot.habitLogs ?? []);
  setSettings({
  ...DEFAULT_SETTINGS,
  ...(snapshot.settings || {}),
});
}, []);
useEffect(() => {
 

  if (!user || !accessToken) {
    console.log("No user logged in");
    return;
  }

  if (hasLoadedCloudRef.current) {
  return;
}
hasLoadedCloudRef.current = true;
   console.log("Cloud Sync Effect");
  console.log("User ID:", user.id);

  async function loadCloudData() {
    try {
      console.log("Downloading snapshot...");

      const snapshot = await pullStudySnapshot({
  accessToken,
  userId: user.id,
});

replaceAllData(snapshot);
setCloudLoaded(true);
    } catch (err) {
  console.error("Cloud Sync Error:", err);
  setCloudLoaded(true);
}
  }

  loadCloudData();
}, [user, accessToken, replaceAllData]);
  
  const streaks = useMemo(() => computeStreaks(liveTasks), [liveTasks]);
  const habitAnalytics = useMemo(() => getHabitAnalytics(habits, habitLogs), [habits, habitLogs]);

  const snapshot = useMemo(() => ({
  subjects,
  lectures,
  tasks: liveTasks,
  personalTasks,
  habits,
  habitLogs,
  settings,
}), [
  subjects,
  lectures,
  liveTasks,
  personalTasks,
  habits,
  habitLogs,
  settings,
]);


  useEffect(() => {
  if (!cloudLoaded) return;
  if (!user || !accessToken) return;

  async function uploadSnapshot() {
    try {
      await pushStudySnapshot({
        accessToken,
        userId: user.id,
        snapshot,
      });

      console.log("Cloud upload successful");
    } catch (err) {
      console.error("Cloud upload failed:", err);
    }
  }
if (uploadTimeoutRef.current) {
  clearTimeout(uploadTimeoutRef.current);
}

uploadTimeoutRef.current = setTimeout(() => {
  uploadSnapshot();
}, 1000);

return () => {
  if (uploadTimeoutRef.current) {
    clearTimeout(uploadTimeoutRef.current);
  }
};
}, [cloudLoaded, user, accessToken, snapshot]);

  const value = useMemo(
  () => ({
    lectures,

    // This is the important line
    tasks: liveTasks,

    personalTasks,
    settings,
    streaks,
    subjects,

    snapshot: {
      subjects,
      lectures,
      tasks,
      personalTasks,
      habits,
      habitLogs,
      settings,
    },

    addLecture,
    deleteLecture,
    toggleTask,

    addPersonalTask,
    editPersonalTask,
    deletePersonalTask,
    togglePersonalTask,

    updateSettings,
    addSubject,
    updateSubject,
    deleteSubject,
    reorderSubjects,

    habits,
    habitLogs,
    habitAnalytics,

    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleHabitLog,

    replaceAllData,
  }),
  [
    lectures,
    liveTasks,
    personalTasks,
    settings,
    streaks,
    subjects,

    addLecture,
    deleteLecture,
    toggleTask,

    addPersonalTask,
    editPersonalTask,
    deletePersonalTask,
    togglePersonalTask,

    updateSettings,
    addSubject,
    updateSubject,
    deleteSubject,
    reorderSubjects,

    habits,
    habitLogs,
    habitAnalytics,

    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleHabitLog,

    replaceAllData,
  ]
    
    [lectures, liveTasks, settings, streaks, subjects, addLecture, deleteLecture, toggleTask, updateSettings, addSubject, updateSubject, deleteSubject, reorderSubjects, habits, habitLogs, habitAnalytics, addHabit, updateHabit, deleteHabit, reorderHabits, toggleHabitLog]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}

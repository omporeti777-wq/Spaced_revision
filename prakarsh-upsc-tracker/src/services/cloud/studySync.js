import { createSupabaseRestClient } from "./supabaseRest.js";

const asIso = (value) => value || new Date().toISOString();

const toSubject = (item, userId) => ({
  id: item.id, user_id: userId, name: item.name, color: item.color,
  sort_order: item.sortOrder, created_at: asIso(item.createdAt), updated_at: asIso(item.updatedAt),
});
const toLecture = (item, userId) => ({
  id: item.id, user_id: userId, subject_id: item.subjectId, lecture_name: item.lectureName,
  course: item.course, faculty: item.faculty, completed_date: item.completedDate,
  difficulty: item.difficulty, priority: item.priority, notes: item.notes,
  created_at: asIso(item.createdAt), updated_at: asIso(item.updatedAt),
});
const toTask = (item, userId) => ({
  id: item.id, user_id: userId, lecture_id: item.lectureId, revision_number: item.revisionNumber,
  label: item.label, due_date: item.date, completed: item.completed, completed_at: item.completedAt,
  priority: item.priority, created_at: asIso(item.createdAt), updated_at: asIso(item.updatedAt),
});
const toHabit = (item, userId) => ({
  id: item.id, user_id: userId, name: item.name, color: item.color, icon: item.icon,
  active: item.active, sort_order: item.sortOrder, created_at: asIso(item.createdAt), updated_at: asIso(item.updatedAt),
});
const toHabitLog = (item, userId) => ({
  id: item.id, user_id: userId, habit_id: item.habitId, log_date: item.date, completed: item.completed,
  created_at: asIso(item.createdAt), updated_at: asIso(item.updatedAt),
});
const toPersonalTask = (item, userId) => ({
  id: item.id,
  user_id: userId,
  title: item.title,
  category: item.category,
  priority: item.priority,
  deadline: item.deadline,
  deadline_time: item.deadlineTime,
  notes: item.notes,
  completed: item.completed,
  created_at: asIso(item.createdAt),
  updated_at: asIso(item.updatedAt),
});

const fromSubject = (row) => ({ id: row.id, userId: row.user_id, name: row.name, color: row.color, sortOrder: row.sort_order, createdAt: row.created_at, updatedAt: row.updated_at });
const fromLecture = (row) => ({ id: row.id, subjectId: row.subject_id, lectureName: row.lecture_name, course: row.course || "", faculty: row.faculty || "", completedDate: row.completed_date, difficulty: row.difficulty, priority: row.priority, notes: row.notes || "", createdAt: row.created_at, updatedAt: row.updated_at });
const fromTask = (row) => ({ id: row.id, lectureId: row.lecture_id, revisionNumber: row.revision_number, label: row.label, date: row.due_date, completed: row.completed, completedAt: row.completed_at, priority: row.priority, createdAt: row.created_at, updatedAt: row.updated_at });
const fromHabit = (row) => ({ id: row.id, userId: row.user_id, name: row.name, color: row.color, icon: row.icon, active: row.active, sortOrder: row.sort_order, createdAt: row.created_at, updatedAt: row.updated_at });
const fromHabitLog = (row) => ({ id: row.id, habitId: row.habit_id, date: row.log_date, completed: row.completed, createdAt: row.created_at, updatedAt: row.updated_at });
const fromPersonalTask = (row) => ({
  id: row.id,
  title: row.title,
  category: row.category,
  priority: row.priority,
  deadline: row.deadline,
  deadlineTime: row.deadline_time,
  notes: row.notes || "",
  completed: row.completed,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const TABLES = [
  { name: "subjects", toRow: toSubject, fromRow: fromSubject },
  { name: "lectures", toRow: toLecture, fromRow: fromLecture },
  { name: "revision_tasks", toRow: toTask, fromRow: fromTask },
  { name: "personal_tasks", toRow: toPersonalTask, fromRow: fromPersonalTask },
  { name: "habits", toRow: toHabit, fromRow: fromHabit },
  { name: "habit_logs", toRow: toHabitLog, fromRow: fromHabitLog },
];

async function replaceTable(client, table, userId, items) {
  const remoteRows = await client.select(table.name, `user_id=eq.${encodeURIComponent(userId)}&select=id`);
  const localIds = new Set(items.map((item) => item.id));
  const removedIds = remoteRows.map((row) => row.id).filter((id) => !localIds.has(id));
  await client.upsert(table.name, items.map((item) => table.toRow(item, userId)));
  await client.deleteByIds(table.name, removedIds);
}

/**
 * Replaces the signed-in user's cloud snapshot with the local snapshot.
 * Calls are ordered to satisfy foreign keys and are safe to retry. This is
 * intentionally invoked by the future authenticated sync coordinator, not
 * anonymous browser code, so every request remains RLS-scoped to auth.uid().
 */
export async function pushStudySnapshot({ accessToken, userId, snapshot }) {
  const client = createSupabaseRestClient(accessToken);
  const byTable = {
    subjects: snapshot.subjects || [], lectures: snapshot.lectures || [], revision_tasks: snapshot.tasks || [],  personal_tasks: snapshot.personalTasks || [],
    habits: snapshot.habits || [], habit_logs: snapshot.habitLogs || [],
  };
  for (const table of TABLES) await replaceTable(client, table, userId, byTable[table.name]);
  await client.upsert("user_settings", [{ user_id: userId, settings: snapshot.settings || {}, updated_at: new Date().toISOString() }], "user_id");
}

/** Pulls the complete signed-in user's snapshot. UI display fields such as
 * subject names are regenerated from the returned subject/lecture relations. */
export async function pullStudySnapshot({ accessToken, userId }) {
  const client = createSupabaseRestClient(accessToken);
  const query = `user_id=eq.${encodeURIComponent(userId)}&select=*`;
  const [subjects, lectures, tasks, personalTasks, habits, habitLogs, settingsRows] = await Promise.all([
  client.select("subjects", `${query}&order=sort_order.asc`),
  client.select("lectures", `${query}&order=created_at.desc`),
  client.select("revision_tasks", query),
  client.select("personal_tasks", query),
  client.select("habits", `${query}&order=sort_order.asc`),
  client.select("habit_logs", query),
  client.select("user_settings", `${query}&limit=1`),
]);

  const mappedSubjects = subjects.map(fromSubject);
  const subjectNames = new Map(mappedSubjects.map((subject) => [subject.id, subject.name]));
  const mappedLectures = lectures.map(fromLecture).map((lecture) => ({ ...lecture, subject: subjectNames.get(lecture.subjectId) || "Other" }));
  return {
    subjects: mappedSubjects,
    lectures: mappedLectures,
    tasks: tasks.map(fromTask).map((task) => {
      const lecture = mappedLectures.find((item) => item.id === task.lectureId);
      return { ...task, subjectId: lecture?.subjectId, subject: lecture?.subject || "Other" };
    }),
    personalTasks: personalTasks.map(fromPersonalTask),
    habits: habits.map(fromHabit),
    habitLogs: habitLogs.map(fromHabitLog),
    settings: settingsRows[0]?.settings || {},
  };
}

import { v4 as uuidv4 } from "uuid";

const SUBJECT_COLORS = [
  "#D4A657",
  "#E2694B",
  "#4FA89B",
  "#7CB77A",
  "#6FA8DC",
  "#B08FD1",
  "#D18FB0",
  "#DDB877",
];

const FALLBACK_COLOR = "#8B9296";

function normaliseName(name) {
  return String(name || "").trim();
}

function nameKey(name) {
  return normaliseName(name).toLocaleLowerCase();
}

function subjectColor(index) {
  return SUBJECT_COLORS[index % SUBJECT_COLORS.length] || FALLBACK_COLOR;
}

function normaliseSubject(subject, index) {
  const now = new Date().toISOString();
  return {
    id: subject.id || uuidv4(),
    // Kept nullable until authentication is introduced. In Supabase this
    // becomes the authenticated user's id and is enforced by RLS.
    userId: subject.userId || null,
    name: normaliseName(subject.name),
    color: subject.color || subjectColor(index),
    sortOrder: Number.isFinite(subject.sortOrder) ? subject.sortOrder : index,
    createdAt: subject.createdAt || now,
    updatedAt: subject.updatedAt || now,
  };
}

/**
 * Builds a complete local subject dataset and upgrades legacy records that
 * only stored a subject name. It is deliberately independent of React so the
 * same migration can run before importing a future remote data source.
 */
export function hydrateSubjectData({ subjects, lectures, tasks }) {
  const storedSubjects = Array.isArray(subjects) ? subjects : [];
  const legacyNames = [...lectures, ...tasks]
    .map((record) => normaliseName(record.subject))
    .filter(Boolean);

  const byName = new Map();
  const resultSubjects = [];

  [...storedSubjects, ...legacyNames.map((name) => ({ name }))].forEach((subject) => {
    const name = normaliseName(subject.name);
    if (!name || byName.has(nameKey(name))) return;
    const normalised = normaliseSubject(subject, resultSubjects.length);
    byName.set(nameKey(normalised.name), normalised);
    resultSubjects.push(normalised);
  });

  resultSubjects.sort((a, b) => a.sortOrder - b.sortOrder || a.createdAt.localeCompare(b.createdAt));
  const orderedSubjects = resultSubjects.map((subject, index) => ({ ...subject, sortOrder: index }));
  const byId = new Map(orderedSubjects.map((subject) => [subject.id, subject]));
  const resolvedByName = new Map(orderedSubjects.map((subject) => [nameKey(subject.name), subject]));

  const resolveSubject = (record) => {
    if (record.subjectId && byId.has(record.subjectId)) return byId.get(record.subjectId);
    return resolvedByName.get(nameKey(record.subject));
  };

  const hydratedLectures = lectures.map((lecture) => {
    const subject = resolveSubject(lecture);
    return subject
      ? { ...lecture, subjectId: subject.id, subject: subject.name }
      : lecture;
  });

  const lectureSubjects = new Map(hydratedLectures.map((lecture) => [lecture.id, lecture]));
  const hydratedTasks = tasks.map((task) => {
    const lecture = lectureSubjects.get(task.lectureId);
    const subject = resolveSubject(task) || (lecture ? byId.get(lecture.subjectId) : null);
    return subject
      ? { ...task, subjectId: subject.id, subject: subject.name }
      : task;
  });

  return { subjects: orderedSubjects, lectures: hydratedLectures, tasks: hydratedTasks };
}

export function createSubject({ name, color, sortOrder, userId = null }) {
  const cleanName = normaliseName(name);
  if (!cleanName) throw new Error("A subject name is required.");

  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    userId,
    name: cleanName,
    color: color || subjectColor(sortOrder || 0),
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function subjectNameKey(name) {
  return nameKey(name);
}

/**
 * Local adapter for the subject persistence boundary. A Supabase adapter can
 * expose the same list/save contract without changing subject consumers.
 */
export function createLocalSubjectRepository({ read, write, key }) {
  return {
    list: () => read(key, []),
    save: (subjects) => write(key, subjects),
  };
}

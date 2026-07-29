import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_INTERVALS } from "../data/defaultSettings";

/**
 * generateRevisionDates
 * ----------------------
 * The single source of truth for the spaced-repetition schedule.
 *
 * Given the date a lecture was completed, this returns an ordered array
 * of "stops" — the Learn day plus every revision day — as plain date
 * strings (YYYY-MM-DD) paired with a human label and revision index.
 *
 * @param {string|Date} completedDate - the day the lecture was learned
 * @param {number[]} intervals - day offsets from completedDate, e.g. [0,1,3,7,14,30]
 * @returns {{ offset: number, date: string, revisionNumber: number, label: string }[]}
 */
export function generateRevisionDates(completedDate, intervals = DEFAULT_INTERVALS) {
  const base = dayjs(completedDate);
  if (!base.isValid()) {
    throw new Error("generateRevisionDates: completedDate is invalid");
  }

  return intervals.map((offset, index) => {
    const date = base.add(offset, "day").format("YYYY-MM-DD");
    const revisionNumber = index; // 0 = Learn, 1..N = Revision 1..N
    const label = revisionNumber === 0 ? "Learn" : `Revision ${revisionNumber}`;
    return { offset, date, revisionNumber, label };
  });
}

/**
 * buildTasksForLecture
 * ---------------------
 * Turns a saved lecture into its full set of independent task records
 * (Learn + every revision). Each task is fully self-contained so it can
 * be queried, filtered, checked off, or rescheduled without touching
 * the others.
 *
 * @param {object} lecture - a lecture record (must include id, subject, lectureName, completedDate, priority)
 * @param {number[]} intervals
 * @returns {object[]} array of task records
 */
export function buildTasksForLecture(lecture, intervals = DEFAULT_INTERVALS) {
  const stops = generateRevisionDates(lecture.completedDate, intervals);
  const now = dayjs().toISOString();

  return stops.map((stop) => ({
    id: uuidv4(),
    lectureId: lecture.id,
    revisionNumber: stop.revisionNumber,
    label: stop.label,
    date: stop.date,
    completed: false,
    completedAt: null,
    status: "pending", // pending | completed | overdue
    priority: lecture.priority,
    subjectId: lecture.subjectId,
    subject: lecture.subject,
    lectureName: lecture.lectureName,
    createdAt: now,
    updatedAt: now,
  }));
}

/**
 * deriveTaskStatus
 * -----------------
 * Computes the live status of a task relative to "today", without
 * mutating stored data. Overdue = incomplete + scheduled date is in
 * the past.
 */
export function deriveTaskStatus(task, today = dayjs()) {
  if (task.completed) return "completed";
  const isPast = dayjs(task.date).isBefore(today, "day");
  return isPast ? "overdue" : "pending";
}

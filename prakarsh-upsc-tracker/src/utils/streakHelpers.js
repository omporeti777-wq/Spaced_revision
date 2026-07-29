import dayjs from "dayjs";

/**
 * computeStreaks
 * ---------------
 * Derives current + longest streak purely from the set of dates on
 * which at least one revision task was completed. This means the
 * streak is always recalculated from source data (task.completedAt),
 * so it can never drift out of sync with reality.
 *
 * @param {object[]} tasks - all task records
 * @returns {{ current: number, longest: number, completedToday: boolean }}
 */
export function computeStreaks(tasks) {
  const completedDates = new Set(
    tasks
      .filter((t) => t.completed && t.completedAt)
      .map((t) => dayjs(t.completedAt).format("YYYY-MM-DD"))
  );

  if (completedDates.size === 0) {
    return { current: 0, longest: 0, completedToday: false };
  }

  const sortedDates = Array.from(completedDates).sort();
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  const completedToday = completedDates.has(today);

  // Longest streak: walk sorted unique dates, count consecutive runs.
  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const diff = dayjs(sortedDates[i]).diff(dayjs(sortedDates[i - 1]), "day");
    if (diff === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
  }

  // Current streak: walk backwards from today (or yesterday, if today
  // hasn't been completed yet — the streak isn't "broken" until a full
  // day passes with nothing completed).
  let current = 0;
  let cursor = completedToday ? today : yesterday;
  if (completedDates.has(cursor)) {
    while (completedDates.has(cursor)) {
      current += 1;
      cursor = dayjs(cursor).subtract(1, "day").format("YYYY-MM-DD");
    }
  }

  return { current, longest, completedToday };
}

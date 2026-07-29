import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const DATE_FORMAT = "YYYY-MM-DD";

export function createHabitLogLookup(logs) {
  return new Set(
    logs
      .filter((log) => log.completed)
      .map((log) => `${log.habitId}:${log.date}`)
  );
}

export function isHabitCompleted(lookup, habitId, date) {
  return lookup.has(`${habitId}:${date}`);
}

export function isHabitScheduledOn(habit, date) {
  if (!habit?.active || !dayjs(date).isValid()) return false;
  const day = dayjs(date).startOf("day");
  const createdOn = dayjs(habit.createdAt).startOf("day");
  return day.isSameOrAfter(createdOn, "day") && !day.isAfter(dayjs(), "day");
}

export function getDayCompletion(habits, lookup, date) {
  const scheduled = habits.filter((habit) => isHabitScheduledOn(habit, date));
  const completed = scheduled.filter((habit) => isHabitCompleted(lookup, habit.id, date)).length;
  return {
    date,
    total: scheduled.length,
    completed,
    percentage: scheduled.length ? Math.round((completed / scheduled.length) * 100) : 0,
  };
}

export function getRangeCompletion(habits, lookup, startDate, endDate) {
  let completed = 0;
  let total = 0;
  let cursor = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).startOf("day");

  while (cursor.isSameOrBefore(end, "day")) {
    const day = getDayCompletion(habits, lookup, cursor.format(DATE_FORMAT));
    completed += day.completed;
    total += day.total;
    cursor = cursor.add(1, "day");
  }

  return { completed, total, percentage: total ? Math.round((completed / total) * 100) : 0 };
}

export function getHabitStreak(habit, lookup, endDate = dayjs()) {
  const end = dayjs(endDate).startOf("day");
  const start = dayjs(habit.createdAt).startOf("day");
  let current = 0;
  let cursor = end;

  while (cursor.isSameOrAfter(start, "day")) {
    const date = cursor.format(DATE_FORMAT);
    if (!isHabitCompleted(lookup, habit.id, date)) break;
    current += 1;
    cursor = cursor.subtract(1, "day");
  }

  let longest = 0;
  let run = 0;
  cursor = start;
  while (cursor.isSameOrBefore(end, "day")) {
    const date = cursor.format(DATE_FORMAT);
    if (isHabitCompleted(lookup, habit.id, date)) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    cursor = cursor.add(1, "day");
  }

  return { current, longest };
}

function getOverallStreak(habits, lookup, endDate = dayjs()) {
  const end = dayjs(endDate).startOf("day");
  const oldestHabit = habits.reduce((oldest, habit) => {
    const created = dayjs(habit.createdAt).startOf("day");
    return !oldest || created.isBefore(oldest, "day") ? created : oldest;
  }, null);
  if (!oldestHabit) return { current: 0, longest: 0 };

  const isPerfectDay = (date) => {
    const day = getDayCompletion(habits, lookup, date);
    return day.total > 0 && day.completed === day.total;
  };

  let current = 0;
  let cursor = end;
  while (cursor.isSameOrAfter(oldestHabit, "day") && isPerfectDay(cursor.format(DATE_FORMAT))) {
    current += 1;
    cursor = cursor.subtract(1, "day");
  }

  let longest = 0;
  let run = 0;
  cursor = oldestHabit;
  while (cursor.isSameOrBefore(end, "day")) {
    if (isPerfectDay(cursor.format(DATE_FORMAT))) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    cursor = cursor.add(1, "day");
  }

  return { current, longest };
}

export function getHabitAnalytics(habits, logs, now = dayjs()) {
  const activeHabits = habits.filter((habit) => habit.active);
  const lookup = createHabitLogLookup(logs);
  const today = dayjs(now).format(DATE_FORMAT);
  const todayCompletion = getDayCompletion(activeHabits, lookup, today);
  const week = getRangeCompletion(activeHabits, lookup, dayjs(now).subtract(6, "day"), now);
  const month = getRangeCompletion(activeHabits, lookup, dayjs(now).subtract(29, "day"), now);
  const dailyHistory = Array.from({ length: 7 }, (_, index) => {
    const date = dayjs(now).subtract(6 - index, "day").format(DATE_FORMAT);
    return { ...getDayCompletion(activeHabits, lookup, date), label: dayjs(date).format("ddd") };
  });
  const monthlyHistory = Array.from({ length: 30 }, (_, index) => {
    const date = dayjs(now).subtract(29 - index, "day").format(DATE_FORMAT);
    return { ...getDayCompletion(activeHabits, lookup, date), label: dayjs(date).format("D MMM") };
  });

  return {
    lookup,
    today: todayCompletion,
    week,
    month,
    // The overall score is the rolling 30-day completion rate.
    score: month.percentage,
    streaks: getOverallStreak(activeHabits, lookup, now),
    habits: activeHabits.map((habit) => ({
      ...habit,
      ...getHabitStreak(habit, lookup, now),
    })),
    dailyHistory,
    monthlyHistory,
  };
}

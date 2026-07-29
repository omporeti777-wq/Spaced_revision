import { v4 as uuidv4 } from "uuid";

const HABIT_COLORS = ["#4FA89B", "#D4A657", "#6FA8DC", "#7CB77A", "#B08FD1", "#E2694B", "#D18FB0"];

function normaliseName(name) {
  return String(name || "").trim();
}

export function habitNameKey(name) {
  return normaliseName(name).toLocaleLowerCase();
}

export function createHabit({ name, color, icon = null, sortOrder, userId = null }) {
  const cleanName = normaliseName(name);
  if (!cleanName) throw new Error("A habit name is required.");

  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    // Reserved for the authenticated Supabase user id in the cloud adapter.
    userId,
    name: cleanName,
    color: color || HABIT_COLORS[(sortOrder || 0) % HABIT_COLORS.length],
    icon,
    active: true,
    sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    createdAt: now,
    updatedAt: now,
  };
}

export function createHabitLog({ habitId, date, completed = true }) {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    habitId,
    date,
    completed,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Local persistence adapter. A Supabase implementation can retain this
 * list/save shape while adding user-scoped remote queries and mutations.
 */
export function createLocalHabitRepository({ read, write, habitsKey, logsKey }) {
  return {
    listHabits: () => read(habitsKey, []),
    saveHabits: (habits) => write(habitsKey, habits),
    listLogs: () => read(logsKey, []),
    saveLogs: (logs) => write(logsKey, logs),
  };
}

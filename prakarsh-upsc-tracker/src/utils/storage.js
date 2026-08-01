// Thin, defensive wrapper around localStorage so the rest of the app
// never has to think about JSON parsing failures or missing keys.

export function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`storage: failed to read "${key}"`, err);
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`storage: failed to write "${key}"`, err);
    return false;
  }
}

export const STORAGE_KEYS = {
  lectures: "upsc-tracker:lectures",
  tasks: "upsc-tracker:tasks",
  personalTasks: "upsc-tracker:personal-tasks",
  subjects: "upsc-tracker:subjects",
  habits: "upsc-tracker:habits",
  habitLogs: "upsc-tracker:habit-logs",
  settings: "upsc-tracker:settings",
  streak: "upsc-tracker:streak",
};

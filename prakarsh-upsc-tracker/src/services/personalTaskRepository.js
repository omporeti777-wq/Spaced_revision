import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export function createPersonalTask(input) {
  return {
    id: uuidv4(),
    title: input.title?.trim() || "Untitled Task",
    category: input.category || "Other",
    priority: input.priority || "Medium",
    deadline: input.deadline || null,
    deadlineTime: input.deadlineTime || null,
    notes: input.notes || "",
    completed: false,
    createdAt: dayjs().toISOString(),
    updatedAt: dayjs().toISOString(),
  };
}

export function updatePersonalTask(task, updates) {
  return {
    ...task,
    ...updates,
    updatedAt: dayjs().toISOString(),
  };
}
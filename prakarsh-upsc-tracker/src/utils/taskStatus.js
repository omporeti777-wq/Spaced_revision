export function getTaskStatus(task) {
  if (task.completed) {
    return "completed";
  }

  if (!task.deadline) {
    return "pending";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(task.deadline);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return "overdue";
  }

  return "pending";
}
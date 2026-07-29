import { useMemo } from "react";
import dayjs from "dayjs";
import { useData } from "../context/DataContext";

/**
 * useTaskSelectors
 * -----------------
 * Centralizes the common ways pages slice the task list, so Dashboard,
 * Today's Tasks, Calendar, etc. all agree on what "today", "upcoming"
 * and "overdue" mean.
 */
export function useTaskSelectors() {
  const { tasks } = useData();

  return useMemo(() => {
    const today = tasks
      .filter((t) => dayjs(t.date).isSame(dayjs(), "day"))
      .sort((a, b) => a.priority?.localeCompare(b.priority));

    const overdue = tasks.filter((t) => t.status === "overdue");

    const upcoming = tasks
      .filter((t) => t.status === "pending" && dayjs(t.date).isAfter(dayjs(), "day"))
      .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

    const completedToday = tasks.filter(
      (t) => t.completed && t.completedAt && dayjs(t.completedAt).isSame(dayjs(), "day")
    );

    return { all: tasks, today, overdue, upcoming, completedToday };
  }, [tasks]);
}

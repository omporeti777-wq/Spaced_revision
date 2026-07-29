import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

export const todayISO = () => dayjs().format("YYYY-MM-DD");

export const isToday = (dateStr) => dayjs(dateStr).isSame(dayjs(), "day");

export const isPast = (dateStr) => dayjs(dateStr).isBefore(dayjs(), "day");

export const isFuture = (dateStr) => dayjs(dateStr).isAfter(dayjs(), "day");

export const friendlyDate = (dateStr) => dayjs(dateStr).format("D MMM YYYY");

export const friendlyDayMonth = (dateStr) => dayjs(dateStr).format("D MMM");

export const greeting = () => {
  const hour = dayjs().hour();
  if (hour < 5) return "Burning the midnight oil";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
};

export const daysBetween = (a, b) => dayjs(b).diff(dayjs(a), "day");

export const startOfWeek = (d = dayjs()) => d.startOf("week");
export const startOfMonth = (d = dayjs()) => d.startOf("month");

export { dayjs };

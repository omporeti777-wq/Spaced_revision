import { useMemo } from "react";
import dayjs from "dayjs";
import { createHabitLogLookup, getDayCompletion } from "../../utils/habitAnalytics";

const LEVEL_COLORS = [
  "bg-ink-700",
  "bg-teal-800/70",
  "bg-teal-700/80",
  "bg-teal-600/90",
  "bg-teal-400",
];

function levelFor(percentage) {
  if (!percentage) return 0;
  if (percentage < 25) return 1;
  if (percentage < 50) return 2;
  if (percentage < 75) return 3;
  return 4;
}

export default function HabitHeatmap({ habits, logs, weeks = 18 }) {
  const lookup = useMemo(() => createHabitLogLookup(logs), [logs]);
  const days = useMemo(() => {
    const totalDays = weeks * 7;
    const start = dayjs().subtract(totalDays - 1, "day").startOf("week");
    return Array.from({ length: totalDays }, (_, index) => start.add(index, "day"));
  }, [weeks]);

  const columns = Array.from({ length: weeks }, (_, index) => days.slice(index * 7, index * 7 + 7));

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col gap-1">
            {column.map((day) => {
              const date = day.format("YYYY-MM-DD");
              const metrics = getDayCompletion(habits, lookup, date);
              const isFuture = day.isAfter(dayjs(), "day");
              const unavailable = !isFuture && metrics.total === 0;
              const title = isFuture
                ? `${day.format("D MMM")} — future day`
                : unavailable
                ? `${day.format("D MMM")} — no habits scheduled`
                : `${day.format("D MMM")} — ${metrics.completed}/${metrics.total} complete (${metrics.percentage}%)`;

              return (
                <div
                  key={date}
                  title={title}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    isFuture || unavailable ? "bg-transparent" : LEVEL_COLORS[levelFor(metrics.percentage)]
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-parchment-500">
        <span>Less</span>
        {LEVEL_COLORS.map((color, index) => <span key={index} className={`w-3 h-3 rounded-sm ${color}`} />)}
        <span>More</span>
      </div>
    </div>
  );
}

import dayjs from "dayjs";
import { useMemo } from "react";

// Renders the last `weeks` weeks of completion activity as a GitHub-style
// heatmap. `countByDate` is a map of "YYYY-MM-DD" -> number of completions.
export default function Heatmap({ countByDate, weeks = 18 }) {
  const days = useMemo(() => {
    const totalDays = weeks * 7;
    const start = dayjs().subtract(totalDays - 1, "day").startOf("week");
    return Array.from({ length: weeks * 7 }, (_, i) => start.add(i, "day"));
  }, [weeks]);

  const max = Math.max(1, ...Object.values(countByDate));

  const levelFor = (count) => {
    if (!count) return 0;
    const ratio = count / max;
    if (ratio > 0.75) return 4;
    if (ratio > 0.5) return 3;
    if (ratio > 0.25) return 2;
    return 1;
  };

  const levelColors = [
    "bg-ink-700",
    "bg-gold-700/50",
    "bg-gold-600/70",
    "bg-gold-500/85",
    "bg-gold-400",
  ];

  const columns = [];
  for (let w = 0; w < weeks; w++) {
    columns.push(days.slice(w * 7, w * 7 + 7));
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-max">
        {columns.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {col.map((d) => {
              const key = d.format("YYYY-MM-DD");
              const count = countByDate[key] || 0;
              const isFuture = d.isAfter(dayjs(), "day");
              return (
                <div
                  key={key}
                  title={`${d.format("D MMM")} — ${count} completed`}
                  className={`w-3 h-3 rounded-sm ${isFuture ? "bg-transparent" : levelColors[levelFor(count)]} transition-colors`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-[11px] text-parchment-500">
        <span>Less</span>
        {levelColors.map((c, i) => (
          <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

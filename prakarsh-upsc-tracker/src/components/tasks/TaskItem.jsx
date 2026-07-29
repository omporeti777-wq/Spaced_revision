import Checkbox from "../ui/Checkbox";
import { PriorityBadge, StatusBadge, SubjectBadge } from "../ui/Badge";
import { friendlyDayMonth } from "../../utils/dateHelpers";
import { useData } from "../../context/DataContext";

export default function TaskItem({ task, showDate = false, compact = false }) {
  const { toggleTask, subjects } = useData();
  const subject = subjects.find((item) => item.id === task.subjectId);

  return (
    <div
      className={`flex items-center gap-3.5 rounded-xl border border-ink-600 bg-ink-800/60 hover:bg-ink-700/60 transition-all duration-200 ${
        compact ? "px-3.5 py-2.5" : "px-4 py-3.5"
      } ${task.completed ? "opacity-55" : ""}`}
    >
      <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium text-parchment-100 truncate ${task.completed ? "line-through" : ""}`}>
          {task.lectureName}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <SubjectBadge subject={subject?.name || task.subject || "Deleted subject"} color={subject?.color || "#8B9296"} />
          <span className="text-[11px] text-parchment-500 font-medium">
            {task.label}
          </span>
          {showDate && (
            <span className="text-[11px] text-parchment-500 font-mono">{friendlyDayMonth(task.date)}</span>
          )}
        </div>
      </div>
      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <PriorityBadge priority={task.priority} />
        {task.status === "overdue" && <StatusBadge status="overdue" />}
      </div>
    </div>
  );
}

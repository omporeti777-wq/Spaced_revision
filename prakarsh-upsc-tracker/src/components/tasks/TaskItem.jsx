import { FiTrash2, FiClock } from "react-icons/fi";
import Checkbox from "../ui/Checkbox";
import Badge, { PriorityBadge, StatusBadge, SubjectBadge } from "../ui/Badge";
import { friendlyDayMonth } from "../../utils/dateHelpers";
import { useData } from "../../context/DataContext";
import { getTaskStatus } from "../../utils/taskStatus";

const CATEGORY_COLORS = {
  Study: "gold",
  College: "teal",
  Personal: "neutral",
  Health: "teal",
  Finance: "gold",
  Other: "neutral",
};

export default function TaskItem({ task, showDate = false, compact = false }) {
  const {
    toggleTask,
    togglePersonalTask,
    deletePersonalTask,
    subjects = [],
  } = useData();

  // Detect Personal Task vs Lecture Revision Task
  const isPersonalTask = "title" in task;
  const status = getTaskStatus(task);

  if (isPersonalTask) {
    const categoryTone = CATEGORY_COLORS[task.category] || "neutral";

    return (
      <div
        className={`group flex items-center gap-3.5 rounded-sm border ${
          status === "overdue"
            ? "border-rust-500/80 bg-rust-500/10 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
            : task.completed
            ? "border-ink-600/80 bg-ink-900/60 opacity-60"
            : "border-ink-600 bg-ink-800/90 hover:border-gold-500/80 hover:shadow-glow"
        } transition-all duration-150 ${
          compact ? "px-3 py-2" : "px-4 py-3"
        }`}
      >
        <Checkbox
          checked={task.completed}
          onChange={() => togglePersonalTask(task.id)}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {task.category && (
              <Badge tone={categoryTone} className="text-[9px] px-1.5 py-0.2">
                {task.category.toUpperCase()}
              </Badge>
            )}

            <p
              className={`text-sm font-display font-bold tracking-wide truncate ${
                task.completed
                  ? "line-through text-parchment-500"
                  : "text-parchment-50"
              }`}
            >
              {task.title}
            </p>

            {task.deadline && (
              <span className={`text-[10px] font-mono flex items-center gap-1 ${
                status === "overdue" ? "text-rust-400 font-bold" : "text-parchment-400"
              }`}>
                <FiClock size={11} />
                {friendlyDayMonth(task.deadline)}
                {task.deadlineTime ? ` // ${task.deadlineTime}` : ""}
              </span>
            )}
          </div>

          {task.notes && (
            <p className="text-xs font-mono text-parchment-400 truncate mt-0.5 max-w-lg">
              // {task.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <PriorityBadge priority={task.priority} />

          {status === "overdue" && <StatusBadge status="overdue" />}
          {task.completed && <StatusBadge status="completed" />}

          {deletePersonalTask && (
            <button
              onClick={() => deletePersonalTask(task.id)}
              title="Delete task directive"
              className="opacity-0 group-hover:opacity-100 p-1 text-parchment-500 hover:text-rust-400 hover:bg-ink-700 rounded transition"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Spaced Repetition Revision Task UI
  const subject = subjects.find((item) => item.id === task.subjectId);

  return (
    <div
      className={`group flex items-center gap-3.5 rounded-sm border ${
        task.status === "overdue"
          ? "border-rust-500/80 bg-rust-500/10 shadow-[0_0_12px_rgba(239,68,68,0.15)]"
          : task.completed
          ? "border-ink-600/80 bg-ink-900/60 opacity-60"
          : "border-ink-600 bg-ink-800/90 hover:border-gold-500/80 hover:shadow-glow"
      } transition-all duration-150 ${
        compact ? "px-3 py-2" : "px-4 py-3"
      }`}
    >
      <Checkbox
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <SubjectBadge
            subject={subject?.name || task.subject || "UNASSIGNED"}
            color={subject?.color || "#FF9100"}
          />

          <span
            className={`text-sm font-display font-bold tracking-wide truncate ${
              task.completed
                ? "line-through text-parchment-500"
                : "text-parchment-50"
            }`}
          >
            {task.lectureName}
          </span>

          {task.revisionNumber === 0 || task.label === "Learn" ? (
            <span className="text-[10px] font-mono font-bold text-teal-300 bg-teal-500/15 border border-teal-500/40 px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(0,240,255,0.15)] flex items-center gap-1">
              <span>▶</span> WATCH VIDEO / STUDY
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold text-gold-400 bg-gold-500/15 border border-gold-500/40 px-2 py-0.5 rounded-sm shadow-[0_0_8px_rgba(255,145,0,0.15)] flex items-center gap-1">
              <span>🔄</span> REVISION {task.revisionNumber || task.label?.replace(/Revision\s*/i, "")}
            </span>
          )}

          {showDate && (
            <span className="text-[10px] font-mono text-parchment-400">
              {friendlyDayMonth(task.date)}
            </span>
          )}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 shrink-0">
        <PriorityBadge priority={task.priority} />

        {task.status === "overdue" && <StatusBadge status="overdue" />}
        {task.completed && <StatusBadge status="completed" />}
      </div>
    </div>
  );
}
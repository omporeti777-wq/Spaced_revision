import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyBody,
  showDate = false,
  compact = false,
}) {
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-6 border border-dashed border-ink-600 rounded-sm bg-ink-950/40">
        {EmptyIcon && (
          <div className="w-12 h-12 rounded-sm bg-gold-500/10 border border-gold-500/30 flex items-center justify-center mb-3 text-gold-400 shadow-[0_0_10px_rgba(255,145,0,0.2)]">
            <EmptyIcon size={22} />
          </div>
        )}
        <p className="text-xs font-display font-bold tracking-widest uppercase text-parchment-100">
          {emptyTitle}
        </p>
        {emptyBody && (
          <p className="text-xs font-mono text-parchment-400 mt-1 max-w-sm">
            // {emptyBody}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <div key={task.id} className="animate-fadeUp" style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}>
          <TaskItem task={task} showDate={showDate} compact={compact} />
        </div>
      ))}
    </div>
  );
}

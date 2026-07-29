import TaskItem from "./TaskItem";

export default function TaskList({ tasks, emptyIcon: EmptyIcon, emptyTitle, emptyBody, showDate = false, compact = false }) {
  if (!tasks.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        {EmptyIcon && (
          <div className="w-12 h-12 rounded-2xl bg-ink-700 flex items-center justify-center mb-3 text-parchment-500">
            <EmptyIcon size={20} />
          </div>
        )}
        <p className="text-sm font-medium text-parchment-300">{emptyTitle}</p>
        {emptyBody && <p className="text-xs text-parchment-500 mt-1 max-w-xs">{emptyBody}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task, i) => (
        <div key={task.id} className="animate-fadeUp" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <TaskItem task={task} showDate={showDate} compact={compact} />
        </div>
      ))}
    </div>
  );
}

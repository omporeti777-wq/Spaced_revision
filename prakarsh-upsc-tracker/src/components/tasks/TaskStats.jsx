import { FiLayers, FiClock, FiCheckSquare, FiAlertTriangle } from "react-icons/fi";
import StatCard from "../dashboard/StatCard";
import { getTaskStatus } from "../../utils/taskStatus";

export default function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => getTaskStatus(t) === "completed").length;
  const pending = tasks.filter((t) => getTaskStatus(t) === "pending").length;
  const overdue = tasks.filter((t) => getTaskStatus(t) === "overdue").length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeUp">
      <StatCard
        label="Total Tasks"
        value={total}
        icon={FiLayers}
        tone="neutral"
        sub="All active & completed"
        delay={0}
      />
      <StatCard
        label="Pending"
        value={pending}
        icon={FiClock}
        tone="gold"
        sub="In progress"
        delay={40}
      />
      <StatCard
        label="Completed"
        value={completed}
        icon={FiCheckSquare}
        tone="teal"
        sub={total > 0 ? `${Math.round((completed / total) * 100)}% completion rate` : "No tasks yet"}
        delay={80}
      />
      <StatCard
        label="Overdue"
        value={overdue}
        icon={FiAlertTriangle}
        tone={overdue > 0 ? "rust" : "neutral"}
        sub={overdue > 0 ? "Needs immediate action" : "All deadlines met"}
        delay={120}
      />
    </div>
  );
}
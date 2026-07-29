import { useState } from "react";
import { FiCheckSquare, FiAlertTriangle } from "react-icons/fi";
import { useTaskSelectors } from "../hooks/useTaskSelectors";
import Card from "../components/ui/Card";
import TaskList from "../components/tasks/TaskList";
import Badge from "../components/ui/Badge";

const TABS = [
  { id: "today", label: "Today" },
  { id: "overdue", label: "Overdue" },
];

export default function TodayTasks() {
  const { today, overdue } = useTaskSelectors();
  const [tab, setTab] = useState("today");

  const activeTasks = tab === "today" ? today : overdue;
  const pendingToday = today.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-display font-semibold text-parchment-50">Today's tasks</h1>
        <p className="text-sm text-parchment-500 mt-1">
          {pendingToday === 0 ? "Everything for today is checked off." : `${pendingToday} revision${pendingToday > 1 ? "s" : ""} left to close out today.`}
        </p>
      </div>

      <div className="flex gap-2 animate-fadeUp" style={{ animationDelay: "60ms" }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              tab === t.id
                ? "bg-ink-700 border-ink-500 text-parchment-50"
                : "bg-transparent border-ink-600 text-parchment-500 hover:text-parchment-100"
            }`}
          >
            {t.id === "overdue" && <FiAlertTriangle size={14} className={overdue.length ? "text-rust-400" : ""} />}
            {t.label}
            <Badge tone={t.id === "overdue" && overdue.length ? "rust" : "neutral"} className="ml-1">
              {t.id === "today" ? today.length : overdue.length}
            </Badge>
          </button>
        ))}
      </div>

      <Card className="p-5 sm:p-6 animate-fadeUp" style={{ animationDelay: "120ms" }}>
        <TaskList
          tasks={activeTasks}
          emptyIcon={tab === "overdue" ? FiAlertTriangle : FiCheckSquare}
          emptyTitle={tab === "overdue" ? "No overdue revisions" : "Nothing due today"}
          emptyBody={tab === "overdue" ? "You're staying on top of your schedule." : "Check back tomorrow, or get ahead by adding a new lecture."}
        />
      </Card>
    </div>
  );
}

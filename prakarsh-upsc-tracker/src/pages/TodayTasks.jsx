import { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  FiCheckSquare,
  FiAlertTriangle,
  FiCrosshair,
} from "react-icons/fi";
import { useData } from "../context/DataContext";
import { useTaskSelectors } from "../hooks/useTaskSelectors";
import Card from "../components/ui/Card";
import TaskList from "../components/tasks/TaskList";
import { friendlyDate } from "../utils/dateHelpers";
import { getTaskStatus } from "../utils/taskStatus";

export default function TodayTasks() {
  const { personalTasks = [] } = useData();
  const { today, overdue } = useTaskSelectors();
  const [tab, setTab] = useState("all-today"); // "all-today" | "revisions" | "personal" | "overdue"

  // Personal tasks segmentation
  const todayPersonal = useMemo(
    () =>
      personalTasks.filter(
        (t) =>
          !t.completed &&
          (!t.deadline || dayjs(t.deadline).isSame(dayjs(), "day"))
      ),
    [personalTasks]
  );

  const overduePersonal = useMemo(
    () => personalTasks.filter((t) => getTaskStatus(t) === "overdue"),
    [personalTasks]
  );

  // Aggregated lists
  const allTodayPending = useMemo(() => {
    return [...today.filter((t) => !t.completed), ...todayPersonal];
  }, [today, todayPersonal]);

  const allOverdue = useMemo(() => {
    return [...overdue, ...overduePersonal];
  }, [overdue, overduePersonal]);

  const activeTasks = useMemo(() => {
    if (tab === "all-today") return allTodayPending;
    if (tab === "revisions") return today;
    if (tab === "personal") return todayPersonal;
    if (tab === "overdue") return allOverdue;
    return allTodayPending;
  }, [tab, allTodayPending, today, todayPersonal, allOverdue]);

  const pendingCount = allTodayPending.length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Tactical HUD Header */}
      <div className="p-5 sm:p-6 rounded-sm border-2 border-gold-500/60 bg-ink-900/90 shadow-glow animate-fadeUp">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-gold-400 uppercase">
                // OPERATION DIRECTIVE: {friendlyDate(new Date()).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-parchment-50 uppercase tracking-wide">
              TODAY'S MISSION CONTROL
            </h1>
            <p className="text-xs sm:text-sm font-tactical text-parchment-300 mt-1 max-w-lg">
              {pendingCount === 0
                ? "ALL STUDY OBJECTIVES CLEARED. REPUTATION MAXIMUM. NO PENDING DRILLS."
                : `ELIMINATE THE FORGETTING CURVE. YOU HAVE ${pendingCount} TARGET DIRECTIVE${pendingCount > 1 ? "S" : ""} SCHEDULED FOR TODAY.`}
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 p-3 rounded-sm bg-ink-950 border border-ink-600">
            <span className="text-[10px] font-mono text-parchment-400 uppercase tracking-wider">
              REMAINING LOAD:
            </span>
            <span className="text-2xl sm:text-3xl font-display font-black text-gold-400 font-mono">
              {pendingCount} DIRECTIVES
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="flex items-center gap-2 flex-wrap animate-fadeUp" style={{ animationDelay: "60ms" }}>
        <button
          onClick={() => setTab("all-today")}
          className={`px-4 py-2 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all ${
            tab === "all-today"
              ? "bg-gold-500 text-ink-950 border-gold-500 shadow-glow font-black"
              : "bg-ink-800 border-ink-600 text-parchment-300 hover:text-parchment-50 hover:border-gold-500"
          }`}
        >
          ALL TODAY ({allTodayPending.length})
        </button>

        <button
          onClick={() => setTab("revisions")}
          className={`px-4 py-2 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all ${
            tab === "revisions"
              ? "bg-gold-500 text-ink-950 border-gold-500 shadow-glow font-black"
              : "bg-ink-800 border-ink-600 text-parchment-300 hover:text-parchment-50 hover:border-gold-500"
          }`}
        >
          REVISIONS ({today.length})
        </button>

        <button
          onClick={() => setTab("personal")}
          className={`px-4 py-2 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all ${
            tab === "personal"
              ? "bg-gold-500 text-ink-950 border-gold-500 shadow-glow font-black"
              : "bg-ink-800 border-ink-600 text-parchment-300 hover:text-parchment-50 hover:border-gold-500"
          }`}
        >
          PERSONAL TASKS ({todayPersonal.length})
        </button>

        <button
          onClick={() => setTab("overdue")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all ${
            tab === "overdue"
              ? "bg-rust-500 text-ink-950 border-rust-500 shadow-glowRed font-black"
              : allOverdue.length > 0
              ? "bg-rust-500/15 border-rust-500/50 text-rust-300 hover:bg-rust-500/25"
              : "bg-ink-800 border-ink-600 text-parchment-300 hover:text-parchment-50"
          }`}
        >
          <FiAlertTriangle size={13} className={allOverdue.length ? "text-rust-400" : ""} />
          OVERDUE ({allOverdue.length})
        </button>
      </div>

      {/* Main Directives Deck */}
      <Card className="p-5 sm:p-7 hud-bracket border border-gold-500/30 animate-fadeUp" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between pb-3.5 border-b border-ink-600 mb-4">
          <div className="flex items-center gap-2">
            <FiCrosshair className="text-gold-400" size={17} />
            <h2 className="text-base font-display font-black text-parchment-50 uppercase tracking-wider">
              {tab === "all-today"
                ? "ALL COMBINED TODAY DIRECTIVES"
                : tab === "revisions"
                ? "SPACED REPETITION REVISION QUEUE"
                : tab === "personal"
                ? "DAILY PERSONAL STUDY GOALS"
                : "OVERDUE CRITICAL REVISIONS"}
            </h2>
          </div>
          <span className="text-xs font-mono text-parchment-400">
            {activeTasks.length} TARGETS IN VIEW
          </span>
        </div>

        <TaskList
          tasks={activeTasks}
          showDate={tab === "overdue"}
          emptyIcon={tab === "overdue" ? FiAlertTriangle : FiCheckSquare}
          emptyTitle={
            tab === "overdue"
              ? "NO OVERDUE DIRECTIVES DETECTED"
              : "ALL OBJECTIVES IN THIS CATEGORY ARE COMPLETED"
          }
          emptyBody={
            tab === "overdue"
              ? "All revision and task intervals are currently on schedule. Exceptional execution!"
              : "You have completed everything in this category for today. Take rest or record a new lecture."
          }
        />
      </Card>
    </div>
  );
}

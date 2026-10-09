import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  FiCheckSquare,
  FiClock,
  FiTrendingUp,
  FiBookOpen,
  FiPlusCircle,
  FiActivity,
  FiTarget,
  FiAlertTriangle,
  FiClipboard,
  FiFolder,
  FiCrosshair,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";
import { useData } from "../context/DataContext";
import { useTaskSelectors } from "../hooks/useTaskSelectors";
import StatCard from "../components/dashboard/StatCard";
import ForgettingCurve from "../components/dashboard/ForgettingCurve";
import TaskList from "../components/tasks/TaskList";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { friendlyDate } from "../utils/dateHelpers";
import { getTaskStatus } from "../utils/taskStatus";

export default function Dashboard() {
  const { user } = useAuth();
  const {
    lectures = [],
    tasks = [],
    personalTasks = [],
    streaks,
    habits = [],
    habitAnalytics,
    subjects = [],
  } = useData();

  const { today, upcoming, completedToday, overdue } = useTaskSelectors();
  const [activeTaskFilter, setActiveTaskFilter] = useState("all-today"); // "all-today" | "revisions" | "personal"

  // Derive Call of Duty callsign
  const operatorCallsign = useMemo(() => {
    if (!user) return "ASPIRANT-01";
    const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (metaName) return metaName.toUpperCase();
    if (user.email) {
      return user.email.split("@")[0].toUpperCase();
    }
    return "ASPIRANT-01";
  }, [user]);

  // Personal tasks for today
  const overduePersonal = useMemo(
    () => personalTasks.filter((t) => getTaskStatus(t) === "overdue"),
    [personalTasks]
  );

  const todayPersonalPending = useMemo(
    () =>
      personalTasks.filter(
        (t) =>
          !t.completed &&
          (!t.deadline || dayjs(t.deadline).isSame(dayjs(), "day"))
      ),
    [personalTasks]
  );

  const completedPersonalToday = useMemo(
    () =>
      personalTasks.filter(
        (t) =>
          t.completed &&
          t.completedAt &&
          dayjs(t.completedAt).isSame(dayjs(), "day")
      ),
    [personalTasks]
  );

  // Combined today tasks list
  const combinedTodayPending = useMemo(() => {
    return [...today.filter((t) => !t.completed), ...todayPersonalPending];
  }, [today, todayPersonalPending]);

  const totalOverdueCount = overdue.length + overduePersonal.length;

  // Daily target counts
  const totalDueToday = today.length + todayPersonalPending.length + completedToday.length + completedPersonalToday.length;
  const totalCompletedToday = completedToday.length + completedPersonalToday.length;
  const remainingToday = (today.length - completedToday.length) + todayPersonalPending.length;
  const progressPercent = totalDueToday > 0 ? Math.round((totalCompletedToday / totalDueToday) * 100) : 100;

  // Subject distribution
  const subjectBreakdown = useMemo(() => {
    const counts = {};
    for (const l of lectures) {
      counts[l.subjectId] = (counts[l.subjectId] || 0) + 1;
    }
    return subjects
      .map((s) => ({
        ...s,
        count: counts[s.id] || 0,
      }))
      .filter((s) => s.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [lectures, subjects]);

  return (
    <div className="space-y-6">
      {/* THREAT ALERT: Overdue Missions Banner */}
      {totalOverdueCount > 0 && (
        <div className="p-4 rounded-sm border-2 border-rust-500/80 bg-rust-500/15 text-rust-300 animate-fadeUp flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_0_15px_rgba(239,68,68,0.25)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-rust-500/30 border border-rust-500 flex items-center justify-center shrink-0 text-rust-400">
              <FiAlertTriangle size={22} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-rust-400 bg-rust-500/20 px-1.5 py-0.5 rounded border border-rust-500/40">
                  CRITICAL DEFCON 1
                </span>
                <p className="text-sm font-display font-bold text-parchment-50 uppercase tracking-wide">
                  {totalOverdueCount} OVERDUE DIRECTIVES DETECTED
                </p>
              </div>
              <p className="text-xs font-mono text-parchment-300 mt-0.5">
                Target intervals expired. Eliminate overdue revisions immediately to maintain retention mastery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link to="/today">
              <button className="px-4 py-2 rounded-sm text-xs font-display font-bold uppercase tracking-wider bg-rust-500 text-ink-950 hover:bg-rust-400 shadow-glowRed transition">
                CLEAR OVERDUE ({overdue.length}) →
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* TOP TACTICAL HUD: TODAY'S STUDY DIRECTIVE (WHAT TO STUDY TODAY) */}
      <Card className="p-5 sm:p-7 relative overflow-hidden animate-fadeUp border-2 border-gold-500/50 bg-gradient-to-r from-ink-900 via-ink-850 to-ink-900 shadow-glow">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            {/* Header Telemetry */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/30">
                <FiCrosshair size={12} className="animate-spin text-gold-400" />
                TACTICAL OPS BRIEFING // {friendlyDate(new Date()).toUpperCase()}
              </span>
              <span className="text-[11px] font-mono text-parchment-500 tracking-wider">
                CALLSIGN: <span className="text-gold-400 font-bold">{operatorCallsign}</span>
              </span>
            </div>

            {/* Big Actionable Title */}
            <div>
              <h1 className="text-2xl sm:text-4xl font-display font-black tracking-wide text-parchment-50 uppercase leading-none">
                {remainingToday === 0 ? (
                  <span className="text-emerald-400 flex items-center gap-2">
                    ✓ ALL DIRECTIVES CLEARED TODAY!
                  </span>
                ) : (
                  <>
                    <span className="text-gold-400">{remainingToday} OBJECTIVES</span> SCHEDULED FOR TODAY
                  </>
                )}
              </h1>
              <p className="text-xs sm:text-sm font-tactical text-parchment-300 mt-2 max-w-xl leading-relaxed">
                {remainingToday === 0
                  ? "Sector fully secured. You have mastered all revisions scheduled for today. Take rest, or log an advance lecture."
                  : `Focus on today's target syllabus load: ${today.length - completedToday.length} spaced revision${(today.length - completedToday.length) === 1 ? "" : "s"} and ${todayPersonalPending.length} personal task${todayPersonalPending.length === 1 ? "" : "s"} awaiting execution.`}
              </p>
            </div>

            {/* Call of Duty Segmented HUD Progress Meter */}
            <div className="pt-2 max-w-lg space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-parchment-300 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                  <FiZap className="text-gold-400" size={13} /> COMBAT COMPLETION METER
                </span>
                <span className="text-gold-400 font-black tracking-wider">
                  {totalCompletedToday}/{totalDueToday} TARGETS CLEARED ({progressPercent}%)
                </span>
              </div>

              {/* Segmented HUD Bar */}
              <div className="w-full h-3.5 bg-ink-950 rounded-sm border border-ink-600 p-0.5 overflow-hidden flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => {
                  const filled = (i + 1) * 10 <= progressPercent;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-full rounded-2xs transition-all duration-300 ${
                        filled
                          ? "bg-gradient-to-r from-gold-500 to-gold-400 shadow-[0_0_8px_#FF9100]"
                          : "bg-ink-700/60"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Quick Deployment Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/add-lecture">
                <Button icon={FiPlusCircle} className="btn-primary">
                  LOG NEW LECTURE
                </Button>
              </Link>
              <Link to="/personal-tasks">
                <Button variant="secondary" icon={FiClipboard}>
                  + NEW TASK DIRECTIVE
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Forgetting Curve Tactical Radar */}
          <div className="w-full lg:w-[380px] shrink-0 p-3 bg-ink-950/70 border border-ink-600/80 rounded-sm">
            <div className="flex items-center justify-between text-[11px] font-mono text-gold-400 uppercase tracking-widest pb-2 border-b border-ink-700 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                RETENTION CURVE RADAR
              </span>
              <span className="text-parchment-500">SPACED ALGORITHM</span>
            </div>
            <ForgettingCurve className="w-full h-auto" />
          </div>
        </div>
      </Card>

      {/* TACTICAL STAT CARDS (KILLSTREAK, DAILY REVISIONS, ETC.) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          label="STUDY KILLSTREAK"
          value={`${streaks.current}D`}
          icon={FiTrendingUp}
          tone="gold"
          sub={`PERSONAL RECORD: ${streaks.longest}D`}
          delay={0}
        />
        <StatCard
          label="TODAY'S REVISIONS"
          value={today.length}
          icon={FiClock}
          tone="teal"
          sub={`${completedToday.length} CLEARED TODAY`}
          delay={40}
        />
        <StatCard
          label="TACTICAL TASKS"
          value={personalTasks.filter((t) => !t.completed).length}
          icon={FiClipboard}
          tone="neutral"
          sub={`${personalTasks.filter((t) => t.completed).length} COMPLETED SO FAR`}
          delay={80}
        />
        {habits.length > 0 ? (
          <StatCard
            label="COMBAT DRILLS"
            value={`${habitAnalytics.today.percentage}%`}
            icon={FiTarget}
            tone="teal"
            sub={`${habitAnalytics.today.completed}/${habitAnalytics.today.total} DRILLS CHECKED`}
            delay={120}
          />
        ) : (
          <StatCard
            label="TOTAL SYLLABUS INTEL"
            value={lectures.length}
            icon={FiBookOpen}
            tone="neutral"
            sub={`${tasks.length} REVISIONS MAPPED`}
            delay={120}
          />
        )}
      </div>

      {/* MAIN MISSION BOARD: EXACTLY WHAT TO STUDY TODAY */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Today's Active Study List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 sm:p-6 hud-bracket border border-gold-500/40">
            {/* Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink-600 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-gold-400 rounded-sm shadow-[0_0_8px_#FF9100]" />
                  <h2 className="text-lg font-display font-black text-parchment-50 uppercase tracking-wider">
                    TODAY'S STUDY LOAD // ACTIVE DIRECTIVES
                  </h2>
                </div>
                <p className="text-xs font-mono text-parchment-400 mt-0.5">
                  CLICK CHECKBOXES TO RECORD COMPLETION
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-1.5 p-1 bg-ink-900 border border-ink-600 rounded-sm">
                <button
                  onClick={() => setActiveTaskFilter("all-today")}
                  className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-2xs transition ${
                    activeTaskFilter === "all-today"
                      ? "bg-gold-500 text-ink-950 font-black shadow-glow"
                      : "text-parchment-400 hover:text-parchment-100"
                  }`}
                >
                  ALL TODAY ({combinedTodayPending.length})
                </button>
                <button
                  onClick={() => setActiveTaskFilter("revisions")}
                  className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-2xs transition ${
                    activeTaskFilter === "revisions"
                      ? "bg-gold-500 text-ink-950 font-black shadow-glow"
                      : "text-parchment-400 hover:text-parchment-100"
                  }`}
                >
                  REVISIONS ({today.length})
                </button>
                <button
                  onClick={() => setActiveTaskFilter("personal")}
                  className={`px-3 py-1 text-xs font-display font-bold uppercase tracking-wider rounded-2xs transition ${
                    activeTaskFilter === "personal"
                      ? "bg-gold-500 text-ink-950 font-black shadow-glow"
                      : "text-parchment-400 hover:text-parchment-100"
                  }`}
                >
                  TASKS ({todayPersonalPending.length})
                </button>
              </div>
            </div>

            {/* Task Items Rendered */}
            {activeTaskFilter === "all-today" && (
              <TaskList
                tasks={combinedTodayPending}
                emptyIcon={FiCheckSquare}
                emptyTitle="ALL MISSION OBJECTIVES CLEARED FOR TODAY"
                emptyBody="No pending revisions or daily study tasks for today. You're in peak form!"
              />
            )}

            {activeTaskFilter === "revisions" && (
              <TaskList
                tasks={today}
                emptyIcon={FiCheckSquare}
                emptyTitle="NO REVISIONS SCHEDULED TODAY"
                emptyBody="Spaced repetition interval is clear today. Great day to log a new lecture."
              />
            )}

            {activeTaskFilter === "personal" && (
              <TaskList
                tasks={todayPersonalPending}
                emptyIcon={FiClipboard}
                emptyTitle="NO PERSONAL TASKS PENDING"
                emptyBody="Add daily targets like reading The Hindu, solving CSAT questions, or writing 1 mains answer."
              />
            )}

            {/* Bottom link to full Today page */}
            <div className="pt-4 mt-4 border-t border-ink-700/80 flex items-center justify-between text-xs font-mono">
              <span className="text-parchment-500">
                NEED FULL VIEW & OVERDUE LIST?
              </span>
              <Link
                to="/today"
                className="text-gold-400 hover:text-gold-300 font-bold flex items-center gap-1.5 uppercase tracking-wider"
              >
                OPEN MISSION CONTROL →
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: Upcoming Radar & Syllabus Sectors */}
        <div className="space-y-4">
          {/* UPCOMING RADAR (NEXT REVISIONS) */}
          <Card className="p-5 hud-bracket border border-ink-600 bg-ink-900/90">
            <div className="flex items-center justify-between pb-3 border-b border-ink-700 mb-3">
              <div className="flex items-center gap-2">
                <FiActivity className="text-teal-400" size={16} />
                <h3 className="text-sm font-display font-bold text-parchment-100 uppercase tracking-widest">
                  RADAR // UPCOMING RECON
                </h3>
              </div>
              <Link
                to="/calendar"
                className="text-[11px] font-mono text-gold-400 hover:text-gold-300"
              >
                CALENDAR →
              </Link>
            </div>

            <TaskList
              tasks={upcoming.slice(0, 5)}
              showDate
              compact
              emptyIcon={FiActivity}
              emptyTitle="NO UPCOMING DRILLS SCHEDULED"
              emptyBody="Future spaced intervals will appear here automatically."
            />
          </Card>

          {/* SYLLABUS SECTOR COVERAGE */}
          <Card className="p-5 hud-bracket border border-ink-600 bg-ink-900/90">
            <div className="flex items-center justify-between pb-3 border-b border-ink-700 mb-3">
              <div className="flex items-center gap-2">
                <FiFolder className="text-gold-400" size={16} />
                <h3 className="text-sm font-display font-bold text-parchment-100 uppercase tracking-widest">
                  SECTOR BREAKDOWN
                </h3>
              </div>
              <Link
                to="/subjects"
                className="text-[11px] font-mono text-gold-400 hover:text-gold-300"
              >
                SECTORS →
              </Link>
            </div>

            {subjectBreakdown.length === 0 ? (
              <p className="text-xs font-mono text-parchment-500 py-4 text-center">
                // NO LECTURES RECORDED YET
              </p>
            ) : (
              <div className="space-y-2.5">
                {subjectBreakdown.map((s) => {
                  const totalLectures = lectures.length || 1;
                  const pct = Math.round((s.count / totalLectures) * 100);
                  return (
                    <div key={s.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-parchment-200 flex items-center gap-1.5 uppercase">
                          <span
                            className="w-2 h-2 rounded-xs shadow-[0_0_6px_currentColor]"
                            style={{ backgroundColor: s.color, color: s.color }}
                          />
                          {s.name}
                        </span>
                        <span className="text-gold-400 font-bold">
                          {s.count} INTEL ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-2xs bg-ink-950 border border-ink-700 overflow-hidden">
                        <div
                          className="h-full rounded-2xs transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: s.color,
                            boxShadow: `0 0 8px ${s.color}`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

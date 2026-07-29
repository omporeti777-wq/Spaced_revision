import { Link } from "react-router-dom";
import { FiCheckSquare, FiClock, FiTrendingUp, FiBookOpen, FiPlusCircle, FiActivity, FiLayers, FiTarget } from "react-icons/fi";
import { useData } from "../context/DataContext";
import { useTaskSelectors } from "../hooks/useTaskSelectors";
import StatCard from "../components/dashboard/StatCard";
import ForgettingCurve from "../components/dashboard/ForgettingCurve";
import TaskList from "../components/tasks/TaskList";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { greeting, friendlyDate } from "../utils/dateHelpers";

export default function Dashboard() {
  const { lectures, tasks, streaks, habits, habitAnalytics } = useData();
  const { today, upcoming, completedToday } = useTaskSelectors();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <Card className="p-6 sm:p-8 relative overflow-hidden animate-fadeUp">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <p className="text-sm text-parchment-500">{friendlyDate(new Date())}</p>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-parchment-50 mt-1">
              {greeting()}, aspirant.
            </h1>
            <p className="text-sm text-parchment-500 mt-2 max-w-md">
              {today.length === 0
                ? "No revisions scheduled for today — a good day to add a fresh lecture."
                : `You have ${today.length} revision${today.length > 1 ? "s" : ""} lined up today. Chip away at the forgetting curve.`}
            </p>
            <Link to="/add-lecture">
              <Button icon={FiPlusCircle} className="mt-5">Add new lecture</Button>
            </Link>
          </div>
          <div className="w-full lg:w-[420px] shrink-0">
            <ForgettingCurve className="w-full h-auto" />
          </div>
        </div>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Study streak" value={`${streaks.current}d`} icon={FiTrendingUp} tone="gold" sub={`Longest: ${streaks.longest}d`} delay={0} />
        <StatCard label="Today's revisions" value={today.length} icon={FiClock} tone="teal" sub={`${completedToday.length} completed`} delay={60} />
        <StatCard label="Total lectures" value={lectures.length} icon={FiBookOpen} tone="neutral" delay={120} />
        <StatCard label="Total revision tasks" value={tasks.length} icon={FiLayers} tone="neutral" delay={180} />
        {habits.length > 0 && <StatCard label="Today's habits" value={`${habitAnalytics.today.percentage}%`} icon={FiTarget} tone="teal" sub={`${habitAnalytics.today.completed}/${habitAnalytics.today.total} complete`} delay={220} />}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Today's tasks */}
        <Card className="p-5 sm:p-6 animate-fadeUp" style={{ animationDelay: "220ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-parchment-50">Today's tasks</h2>
            <Link to="/today" className="text-xs text-gold-400 hover:text-gold-300 font-medium">View all →</Link>
          </div>
          <TaskList
            tasks={today.slice(0, 5)}
            emptyIcon={FiCheckSquare}
            emptyTitle="Nothing due today"
            emptyBody="Enjoy the breather, or get ahead by logging a new lecture."
          />
        </Card>

        {/* Recent activity / upcoming */}
        <Card className="p-5 sm:p-6 animate-fadeUp" style={{ animationDelay: "260ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg text-parchment-50">Upcoming revisions</h2>
            <Link to="/calendar" className="text-xs text-gold-400 hover:text-gold-300 font-medium">Open calendar →</Link>
          </div>
          <TaskList
            tasks={upcoming.slice(0, 5)}
            showDate
            emptyIcon={FiActivity}
            emptyTitle="No upcoming revisions"
            emptyBody="Add a lecture and its schedule will appear here automatically."
          />
        </Card>
      </div>

      <Card className="p-5 sm:p-6 animate-fadeUp" style={{ animationDelay: "300ms" }}>
        <h2 className="font-display text-lg text-parchment-50 mb-4">Recent activity</h2>
        {lectures.length === 0 ? (
          <p className="text-sm text-parchment-500">Your saved lectures will show up here.</p>
        ) : (
          <div className="divide-y divide-ink-600">
            {lectures.slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm text-parchment-100 truncate">{l.lectureName}</p>
                  <p className="text-xs text-parchment-500">{l.subject}{l.faculty ? ` · ${l.faculty}` : ""}</p>
                </div>
                <span className="text-xs text-parchment-500 font-mono shrink-0 ml-3">{friendlyDate(l.completedDate)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

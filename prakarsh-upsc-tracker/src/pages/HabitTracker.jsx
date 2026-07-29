import { useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiActivity,
  FiAlertTriangle,
  FiAward,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiEdit2,
  FiPlus,
  FiTarget,
  FiTrash2,
  FiTrendingUp,
} from "react-icons/fi";
import { useData } from "../context/DataContext";
import { isHabitCompleted, isHabitScheduledOn } from "../utils/habitAnalytics";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Checkbox from "../components/ui/Checkbox";
import Modal from "../components/ui/Modal";
import StatCard from "../components/dashboard/StatCard";
import HabitHeatmap from "../components/habits/HabitHeatmap";

const DEFAULT_COLOR = "#4FA89B";
const TOOLTIP_STYLE = {
  background: "#1E262B",
  border: "1px solid #2A3236",
  borderRadius: 10,
  fontSize: 12,
  color: "#ECE8DE",
};

export default function HabitTracker() {
  const {
    habits,
    habitLogs,
    habitAnalytics,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleHabitLog,
  } = useData();
  const [editor, setEditor] = useState(null);
  const [habitToDelete, setHabitToDelete] = useState(null);
  const [draft, setDraft] = useState({ name: "", color: DEFAULT_COLOR });
  const [formError, setFormError] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  const visibleDays = useMemo(() => Array.from({ length: 7 }, (_, index) => (
    dayjs().subtract(6 + weekOffset * 7 - index, "day").format("YYYY-MM-DD")
  )), [weekOffset]);
  const habitStats = useMemo(() => new Map(habitAnalytics.habits.map((habit) => [habit.id, habit])), [habitAnalytics.habits]);
  const activeHabits = habits.filter((habit) => habit.active);
  const deletedHabitLogs = habitToDelete ? habitLogs.filter((log) => log.habitId === habitToDelete.id).length : 0;

  const openCreate = () => {
    setEditor("create");
    setDraft({ name: "", color: DEFAULT_COLOR });
    setFormError("");
  };

  const openEdit = (habit) => {
    setEditor(habit);
    setDraft({ name: habit.name, color: habit.color });
    setFormError("");
  };

  const closeEditor = () => {
    setEditor(null);
    setFormError("");
  };

  const submitHabit = (event) => {
    event.preventDefault();
    try {
      if (editor === "create") addHabit(draft);
      else updateHabit(editor.id, draft);
      closeEditor();
    } catch (error) {
      setFormError(error.message || "Unable to save this habit.");
    }
  };

  const moveHabit = (habitId, direction) => {
    const index = activeHabits.findIndex((habit) => habit.id === habitId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= activeHabits.length) return;
    const orderedIds = activeHabits.map((habit) => habit.id);
    [orderedIds[index], orderedIds[nextIndex]] = [orderedIds[nextIndex], orderedIds[index]];
    reorderHabits(orderedIds);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fadeUp">
        <div>
          <h1 className="text-2xl font-display font-semibold text-parchment-50">Habit tracker</h1>
          <p className="text-sm text-parchment-500 mt-1">Turn the small promises you make to yourself into a visible routine.</p>
        </div>
        <Button icon={FiPlus} onClick={openCreate}>Add habit</Button>
      </div>

      {activeHabits.length === 0 ? (
        <Card className="flex flex-col items-center text-center py-16 animate-fadeUp">
          <FiTarget className="text-parchment-500 mb-3" size={28} />
          <p className="text-sm text-parchment-300">No habits yet</p>
          <p className="text-xs text-parchment-500 mt-1">Start with one small daily action, then build from there.</p>
          <Button icon={FiPlus} onClick={openCreate} className="mt-5">Add your first habit</Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Today" value={`${habitAnalytics.today.percentage}%`} icon={FiTarget} tone="gold" sub={`${habitAnalytics.today.completed}/${habitAnalytics.today.total} complete`} delay={0} />
            <StatCard label="This week" value={`${habitAnalytics.week.percentage}%`} icon={FiTrendingUp} tone="teal" sub={`${habitAnalytics.week.completed}/${habitAnalytics.week.total} complete`} delay={40} />
            <StatCard label="This month" value={`${habitAnalytics.month.percentage}%`} icon={FiActivity} tone="neutral" sub={`${habitAnalytics.month.completed}/${habitAnalytics.month.total} complete`} delay={80} />
            <StatCard label="Habit score" value={`${habitAnalytics.score}%`} icon={FiAward} tone="neutral" sub="Rolling 30 days" delay={120} />
          </div>

          <Card className="p-5 sm:p-6 animate-fadeUp" style={{ animationDelay: "160ms" }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
              <div>
                <h2 className="font-display text-lg text-parchment-50">Daily check-in</h2>
                <p className="text-xs text-parchment-500 mt-1">Mark any day. Dates before a habit was created are left blank.</p>
              </div>
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <button onClick={() => setWeekOffset((offset) => offset + 1)} className="p-2 text-parchment-500 hover:text-parchment-100" title="Show previous week"><FiChevronLeft size={17} /></button>
                <span className="text-xs text-parchment-400 min-w-28 text-center">{weekOffset === 0 ? "This week" : `${weekOffset} week${weekOffset > 1 ? "s" : ""} ago`}</span>
                <button onClick={() => setWeekOffset((offset) => Math.max(0, offset - 1))} disabled={weekOffset === 0} className="p-2 text-parchment-500 hover:text-parchment-100 disabled:opacity-25" title="Show next week"><FiChevronRight size={17} /></button>
              </div>
            </div>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[760px] text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-[11px] uppercase tracking-wide text-parchment-500">
                    <th className="pb-3 font-medium min-w-44">Habit</th>
                    {visibleDays.map((date) => <th key={date} className="pb-3 font-medium text-center w-12"><span className="block">{dayjs(date).format("dd")}</span><span className="text-parchment-400">{dayjs(date).format("D")}</span></th>)}
                    <th className="pb-3 font-medium pl-4">Streak</th>
                    <th className="pb-3 font-medium text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-600">
                  {activeHabits.map((habit, index) => {
                    const stats = habitStats.get(habit.id) || { current: 0, longest: 0 };
                    return (
                      <tr key={habit.id}>
                        <td className="py-3.5 pr-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: habit.color }} />
                            <span className="text-sm font-medium text-parchment-100 truncate max-w-40">{habit.name}</span>
                          </div>
                        </td>
                        {visibleDays.map((date) => {
                          const scheduled = isHabitScheduledOn(habit, date);
                          const completed = isHabitCompleted(habitAnalytics.lookup, habit.id, date);
                          return (
                            <td key={date} className="py-3.5 text-center">
                              {scheduled ? <Checkbox checked={completed} onChange={() => toggleHabitLog(habit.id, date)} size="sm" aria-label={`${habit.name} on ${dayjs(date).format("D MMMM")}`} /> : <span className="text-parchment-600">—</span>}
                            </td>
                          );
                        })}
                        <td className="py-3.5 pl-4 whitespace-nowrap text-xs text-parchment-400"><span className="text-gold-400 font-medium">{stats.current}d</span> current <span className="text-parchment-600 mx-1">·</span> {stats.longest}d best</td>
                        <td className="py-3.5 text-right whitespace-nowrap">
                          <button onClick={() => moveHabit(habit.id, -1)} disabled={index === 0} title="Move habit up" className="p-1.5 text-parchment-500 hover:text-parchment-100 disabled:opacity-25"><FiChevronUp size={15} /></button>
                          <button onClick={() => moveHabit(habit.id, 1)} disabled={index === activeHabits.length - 1} title="Move habit down" className="p-1.5 text-parchment-500 hover:text-parchment-100 disabled:opacity-25"><FiChevronDown size={15} /></button>
                          <button onClick={() => openEdit(habit)} title={`Edit ${habit.name}`} className="p-1.5 text-parchment-500 hover:text-parchment-100"><FiEdit2 size={15} /></button>
                          <button onClick={() => setHabitToDelete(habit)} title={`Delete ${habit.name}`} className="p-1.5 text-parchment-500 hover:text-rust-400"><FiTrash2 size={15} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 animate-fadeUp" style={{ animationDelay: "200ms" }}>
              <h2 className="font-display text-lg text-parchment-50 mb-1">Weekly completion</h2>
              <p className="text-xs text-parchment-500 mb-4">Percentage of scheduled habits completed each day.</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={habitAnalytics.dailyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3236" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#8B9296", fontSize: 12 }} axisLine={{ stroke: "#2A3236" }} tickLine={false} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#8B9296", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, "Completion"]} />
                  <Bar dataKey="percentage" fill="#4FA89B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-6 animate-fadeUp" style={{ animationDelay: "240ms" }}>
              <h2 className="font-display text-lg text-parchment-50 mb-1">Last 30 days</h2>
              <p className="text-xs text-parchment-500 mb-4">Your daily completion rate over the past month.</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={habitAnalytics.monthlyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A3236" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#8B9296", fontSize: 10 }} axisLine={{ stroke: "#2A3236" }} tickLine={false} interval={4} />
                  <YAxis domain={[0, 100]} unit="%" tick={{ fill: "#8B9296", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value) => [`${value}%`, "Completion"]} />
                  <Bar dataKey="percentage" fill="#D4A657" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
            <Card className="p-6 animate-fadeUp" style={{ animationDelay: "280ms" }}>
              <h2 className="font-display text-lg text-parchment-50 mb-1">Consistency heatmap</h2>
              <p className="text-xs text-parchment-500 mb-4">Each square represents your completion percentage for one day.</p>
              <HabitHeatmap habits={activeHabits} logs={habitLogs} />
            </Card>
            <Card className="p-6 animate-fadeUp" style={{ animationDelay: "320ms" }}>
              <h2 className="font-display text-lg text-parchment-50 mb-1">Perfect-day streak</h2>
              <p className="text-xs text-parchment-500 mb-5">A day counts when every scheduled habit is completed.</p>
              <div className="space-y-4">
                <div><p className="text-3xl font-display font-semibold text-gold-400">{habitAnalytics.streaks.current}d</p><p className="text-xs text-parchment-500 mt-1">Current streak</p></div>
                <div className="h-px bg-ink-600" />
                <div><p className="text-xl font-display font-semibold text-parchment-100">{habitAnalytics.streaks.longest}d</p><p className="text-xs text-parchment-500 mt-1">Longest streak</p></div>
              </div>
            </Card>
          </div>
        </>
      )}

      <Modal open={Boolean(editor)} onClose={closeEditor} title={editor === "create" ? "Add habit" : "Edit habit"}>
        <form onSubmit={submitHabit} className="space-y-5">
          <div>
            <label className="label-text" htmlFor="habit-name">Habit name</label>
            <input id="habit-name" autoFocus className="input-field" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="e.g. Read for 30 minutes" />
          </div>
          <div>
            <label className="label-text" htmlFor="habit-color">Habit colour</label>
            <div className="flex items-center gap-3">
              <input id="habit-color" type="color" value={draft.color} onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))} className="h-10 w-14 rounded-lg border border-ink-600 bg-ink-900 p-1 cursor-pointer" />
              <span className="text-xs text-parchment-500">Used across your tracker and charts.</span>
            </div>
          </div>
          {formError && <p className="text-sm text-rust-300">{formError}</p>}
          <div className="flex justify-end gap-3 pt-1"><Button type="button" variant="ghost" onClick={closeEditor}>Cancel</Button><Button type="submit">{editor === "create" ? "Add habit" : "Save changes"}</Button></div>
        </form>
      </Modal>

      <Modal open={Boolean(habitToDelete)} onClose={() => setHabitToDelete(null)} title="Delete habit">
        <div className="space-y-5">
          <div className="flex gap-3"><FiAlertTriangle className="text-rust-400 shrink-0 mt-0.5" size={18} /><p className="text-sm text-parchment-300">Delete <span className="text-parchment-50 font-medium">{habitToDelete?.name}</span>? This permanently removes its {deletedHabitLogs} completion record{deletedHabitLogs === 1 ? "" : "s"}.</p></div>
          <p className="text-xs text-parchment-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3"><Button type="button" variant="ghost" onClick={() => setHabitToDelete(null)}>Cancel</Button><Button type="button" onClick={() => { deleteHabit(habitToDelete.id); setHabitToDelete(null); }} className="!bg-rust-500 !text-white hover:!bg-rust-400">Delete habit</Button></div>
        </div>
      </Modal>
    </div>
  );
}

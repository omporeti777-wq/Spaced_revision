import { useMemo } from "react";
import dayjs from "dayjs";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from "recharts";
import { FiTrendingUp, FiAward, FiTarget, FiCheckCircle } from "react-icons/fi";
import { useData } from "../context/DataContext";
import StatCard from "../components/dashboard/StatCard";
import Card from "../components/ui/Card";
import Heatmap from "../components/stats/Heatmap";
import ForgettingCurve from "../components/dashboard/ForgettingCurve";

const CHART_TOOLTIP_STYLE = {
  background: "#1E262B",
  border: "1px solid #2A3236",
  borderRadius: 10,
  fontSize: 12,
  color: "#ECE8DE",
};

export default function Statistics() {
  const { lectures, tasks, streaks, subjects } = useData();

  const completedTasks = tasks.filter((t) => t.completed);
  const completionPct = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const countByDate = useMemo(() => {
    const map = {};
    completedTasks.forEach((t) => {
      const key = dayjs(t.completedAt).format("YYYY-MM-DD");
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [completedTasks]);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = dayjs().subtract(6 - i, "day");
      const key = d.format("YYYY-MM-DD");
      return { label: d.format("ddd"), count: countByDate[key] || 0 };
    });
  }, [countByDate]);

  const monthlyData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = dayjs().subtract(29 - i, "day");
      const key = d.format("YYYY-MM-DD");
      return { label: d.format("D MMM"), count: countByDate[key] || 0 };
    }).filter((_, i) => i % 2 === 0);
  }, [countByDate]);

  const subjectData = useMemo(() => {
    return subjects.map((subject) => {
      const subjectTasks = tasks.filter((task) => task.subjectId === subject.id);
      const done = subjectTasks.filter((t) => t.completed).length;
      return { name: subject.name, value: subjectTasks.length, done, color: subject.color };
    }).filter((s) => s.value > 0);
  }, [subjects, tasks]);

  return (
    <div className="space-y-8">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-display font-semibold text-parchment-50">Statistics</h1>
        <p className="text-sm text-parchment-500 mt-1">How well the spaced-repetition schedule is actually holding up.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Current streak" value={`${streaks.current}d`} icon={FiTrendingUp} tone="gold" delay={0} />
        <StatCard label="Longest streak" value={`${streaks.longest}d`} icon={FiAward} tone="teal" delay={40} />
        <StatCard label="Lectures completed" value={lectures.length} icon={FiTarget} tone="neutral" delay={80} />
        <StatCard label="Completion rate" value={`${completionPct}%`} icon={FiCheckCircle} tone="neutral" delay={120} sub={`${completedTasks.length}/${tasks.length} tasks`} />
      </div>

      <Card className="p-6 animate-fadeUp" style={{ animationDelay: "160ms" }}>
        <h2 className="font-display text-lg text-parchment-50 mb-2">Memory curve, automated</h2>
        <p className="text-xs text-parchment-500 mb-4 max-w-lg">
          Each revision jolts retention back up and flattens the decay — this is the exact schedule the app is running for every lecture you save.
        </p>
        <ForgettingCurve className="w-full max-w-2xl h-auto" />
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 animate-fadeUp" style={{ animationDelay: "200ms" }}>
          <h2 className="font-display text-lg text-parchment-50 mb-4">This week</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3236" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#8B9296", fontSize: 12 }} axisLine={{ stroke: "#2A3236" }} tickLine={false} />
              <YAxis tick={{ fill: "#8B9296", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: "rgba(212,166,87,0.06)" }} />
              <Bar dataKey="count" fill="#D4A657" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 animate-fadeUp" style={{ animationDelay: "240ms" }}>
          <h2 className="font-display text-lg text-parchment-50 mb-4">Last 30 days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3236" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#8B9296", fontSize: 10 }} axisLine={{ stroke: "#2A3236" }} tickLine={false} interval={2} />
              <YAxis tick={{ fill: "#8B9296", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} cursor={{ fill: "rgba(79,168,155,0.08)" }} />
              <Bar dataKey="count" fill="#4FA89B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 animate-fadeUp" style={{ animationDelay: "280ms" }}>
        <h2 className="font-display text-lg text-parchment-50 mb-4">Activity heatmap</h2>
        <Heatmap countByDate={countByDate} />
      </Card>

      <Card className="p-6 animate-fadeUp" style={{ animationDelay: "320ms" }}>
        <h2 className="font-display text-lg text-parchment-50 mb-4">Subject-wise progress</h2>
        {subjectData.length === 0 ? (
          <p className="text-sm text-parchment-500">Add lectures to see a subject-wise breakdown.</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={subjectData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {subjectData.map((s) => (
                    <Cell key={s.name} fill={s.color} stroke="#171D21" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {subjectData.map((s) => {
                const pct = s.value ? Math.round((s.done / s.value) * 100) : 0;
                return (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-2 text-parchment-300">
                        <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                        {s.name}
                      </span>
                      <span className="text-parchment-500">{s.done}/{s.value} · {pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: s.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

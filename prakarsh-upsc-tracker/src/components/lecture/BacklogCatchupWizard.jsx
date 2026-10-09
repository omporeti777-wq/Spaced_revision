import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import {
  FiZap,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { useData } from "../../context/DataContext";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function BacklogCatchupWizard({ onDeployed }) {
  const { subjects = [], addSubject, addLecturesBatch } = useData();

  // Find or default to Geography if available
  const initialSubject = useMemo(() => {
    const geo = subjects.find((s) => s.name.toLowerCase().includes("geography"));
    return geo ? geo.id : subjects[0]?.id || "";
  }, [subjects]);

  const [subjectId, setSubjectId] = useState(initialSubject);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [showAddSubject, setShowAddSubject] = useState(false);

  const [totalLectures, setTotalLectures] = useState(40);
  const [namingPrefix, setNamingPrefix] = useState("Geography Lecture");
  const [lecturesPerDay, setLecturesPerDay] = useState(1);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [faculty, setFaculty] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [difficulty, setDifficulty] = useState("Medium");

  const [deploying, setDeploying] = useState(false);
  const [deployedSummary, setDeployedSummary] = useState(null);
  const [error, setError] = useState("");

  // Handle on-the-fly subject creation
  const handleCreateSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      const created = addSubject({
        name: newSubjectName.trim(),
        color: "#4FA89B",
      });
      setSubjectId(created.id);
      setNewSubjectName("");
      setShowAddSubject(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate schedule forecast
  const forecast = useMemo(() => {
    const count = Math.max(1, parseInt(totalLectures, 10) || 1);
    const perDay = Math.max(1, parseInt(lecturesPerDay, 10) || 1);
    const start = dayjs(startDate);

    const totalDays = Math.ceil(count / perDay);
    const endDate = start.add(totalDays - 1, "day").format("YYYY-MM-DD");

    const schedulePreview = [];
    for (let i = 0; i < Math.min(count, 7); i++) {
      const dayOffset = Math.floor(i / perDay);
      const targetDate = start.add(dayOffset, "day").format("YYYY-MM-DD");
      schedulePreview.push({
        name: `${namingPrefix.trim()} ${i + 1}`,
        date: targetDate,
        isToday: dayjs(targetDate).isSame(dayjs(), "day"),
      });
    }

    return {
      totalDays,
      endDate,
      schedulePreview,
      totalCount: count,
      perDay,
    };
  }, [totalLectures, lecturesPerDay, startDate, namingPrefix]);

  const handleDeploy = () => {
    if (!subjectId) {
      setError("Please select or create a subject first.");
      return;
    }

    setDeploying(true);
    setError("");

    try {
      const count = Math.max(1, parseInt(totalLectures, 10) || 1);
      const perDay = Math.max(1, parseInt(lecturesPerDay, 10) || 1);
      const start = dayjs(startDate);

      const batchToCreate = [];

      for (let i = 0; i < count; i++) {
        const dayOffset = Math.floor(i / perDay);
        const scheduledDate = start.add(dayOffset, "day").format("YYYY-MM-DD");

        batchToCreate.push({
          subjectId,
          lectureName: `${namingPrefix.trim()} ${i + 1}`,
          course: "Catch-up Syllabus Backlog",
          faculty: faculty.trim(),
          completedDate: scheduledDate,
          difficulty,
          priority,
          notes: "Scheduled via Tactical Backlog Catchup Wizard",
        });
      }

      const created = addLecturesBatch(batchToCreate);

      setDeployedSummary({
        count: created.length,
        subjectName: subjects.find((s) => s.id === subjectId)?.name || "Subject",
        startDate: dayjs(startDate).format("MMM D, YYYY"),
        endDate: dayjs(forecast.endDate).format("MMM D, YYYY"),
        todayLecture: batchToCreate[0]?.lectureName,
      });

      onDeployed?.(created);
    } catch (err) {
      setError(err.message || "Failed to deploy backlog schedule.");
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Briefing Banner */}
      <div className="p-4 rounded-sm border border-gold-500/40 bg-gold-500/10 text-gold-400">
        <div className="flex items-start gap-3">
          <FiZap size={20} className="mt-0.5 shrink-0 text-gold-400" />
          <div className="space-y-1">
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-parchment-50">
              TACTICAL BACKLOG INFILTRATION // PACED SCHEDULE
            </h3>
            <p className="text-xs font-tactical text-parchment-300 leading-relaxed">
              Studied past lectures without spaced repetition? This tool schedules all your completed lectures (e.g. 40 Geography lectures) at a sustainable pace (e.g. 1 per day starting today), preventing overdue shock and reviving long-term retention.
            </p>
          </div>
        </div>
      </div>

      {deployedSummary ? (
        <Card className="p-6 hud-bracket border-2 border-emerald-500/80 bg-ink-900 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-fadeUp">
          <div className="text-center space-y-3 py-2">
            <div className="w-12 h-12 rounded-sm bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_12px_#00E676]">
              <FiCheckCircle size={24} />
            </div>
            <h2 className="text-2xl font-display font-black text-parchment-50 uppercase tracking-wide">
              {deployedSummary.count} LECTURES SUCCESSFULLY DEPLOYED!
            </h2>
            <p className="text-xs font-mono text-parchment-300 max-w-md mx-auto">
              Added under <span className="text-gold-400 font-bold">{deployedSummary.subjectName}</span>. Scheduled smoothly from {deployedSummary.startDate} to {deployedSummary.endDate}.
            </p>

            <div className="p-4 rounded-sm bg-ink-950 border border-ink-600 max-w-md mx-auto text-left space-y-1.5 font-mono text-xs">
              <div className="text-gold-400 font-bold flex items-center gap-2">
                <span>TODAY'S MISSION DIRECTIVE:</span>
                <span className="text-parchment-50">{deployedSummary.todayLecture}</span>
              </div>
              <p className="text-parchment-400 text-[11px]">
                Spaced repetition tasks (R1, R2, R3, R4, R5) will automatically appear on your schedule as days progress.
              </p>
            </div>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link to="/today">
                <Button className="btn-primary">
                  START TODAY'S DIRECTIVE →
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setDeployedSummary(null)}
              >
                Schedule Another Subject
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="p-3 rounded-sm border border-rust-500 bg-rust-500/10 text-rust-300 text-xs font-mono">
              // ERROR: {error}
            </div>
          )}

          {/* Configuration Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Subject Selector */}
            <div className="space-y-1.5">
              <label className="label-text">Sector Subject *</label>
              <div className="flex gap-2">
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="input-field flex-1"
                >
                  <option value="" disabled>
                    -- Select Subject --
                  </option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowAddSubject((prev) => !prev)}
                  className="px-3 py-2 bg-ink-800 border border-ink-600 hover:border-gold-500 text-xs font-mono text-gold-400 rounded-sm transition"
                  title="Create new subject"
                >
                  + New
                </button>
              </div>

              {showAddSubject && (
                <form
                  onSubmit={handleCreateSubject}
                  className="mt-2 p-3 bg-ink-900 border border-gold-500/40 rounded-sm flex gap-2 animate-fadeUp"
                >
                  <input
                    type="text"
                    placeholder="e.g. Geography"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="input-field flex-1 text-xs"
                    autoFocus
                  />
                  <Button type="submit" className="text-xs px-3 py-1.5">
                    Save
                  </Button>
                </form>
              )}
            </div>

            {/* Total Lectures Count */}
            <div className="space-y-1.5">
              <label className="label-text">Total Lectures to Schedule *</label>
              <input
                type="number"
                min="1"
                max="200"
                value={totalLectures}
                onChange={(e) => setTotalLectures(e.target.value)}
                className="input-field font-mono font-bold text-gold-400"
                placeholder="40"
              />
            </div>

            {/* Title Prefix */}
            <div className="space-y-1.5">
              <label className="label-text">Lecture Name Prefix</label>
              <input
                type="text"
                value={namingPrefix}
                onChange={(e) => setNamingPrefix(e.target.value)}
                placeholder="Geography Lecture"
                className="input-field"
              />
              <p className="text-[10px] font-mono text-parchment-500">
                Will generate: "{namingPrefix.trim()} 1", "{namingPrefix.trim()} 2"...
              </p>
            </div>

            {/* Pacing: Lectures per day */}
            <div className="space-y-1.5">
              <label className="label-text">Revision Pace (Lectures Per Day) *</label>
              <select
                value={lecturesPerDay}
                onChange={(e) => setLecturesPerDay(Number(e.target.value))}
                className="input-field font-mono font-bold"
              >
                <option value={1}>1 Lecture / Day (Recommended: 40 Days)</option>
                <option value={2}>2 Lectures / Day (Intensive: 20 Days)</option>
                <option value={3}>3 Lectures / Day (Rapid: 14 Days)</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="space-y-1.5">
              <label className="label-text">Start Date *</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field font-mono"
              />
            </div>

            {/* Faculty / Source */}
            <div className="space-y-1.5">
              <label className="label-text">Faculty / Source (Optional)</label>
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                placeholder="e.g. Sudarshan Gurjar / Self Notes"
                className="input-field"
              />
            </div>
          </div>

          {/* Live Tactical Forecast Radar */}
          <div className="p-4 rounded-sm bg-ink-950 border border-ink-600 space-y-3">
            <div className="flex items-center justify-between border-b border-ink-700 pb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                <FiCalendar /> FORECAST SCHEDULE PREVIEW
              </span>
              <span className="text-[11px] font-mono text-parchment-400">
                TIMELINE: <span className="text-gold-400 font-bold">{forecast.totalDays} DAYS</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-sm bg-ink-900 border border-ink-700">
                <p className="text-parchment-500 text-[10px] uppercase">DEPLOYMENT START</p>
                <p className="text-parchment-100 font-bold mt-0.5">
                  {dayjs(startDate).format("MMM D, YYYY")}
                </p>
              </div>
              <div className="p-2.5 rounded-sm bg-ink-900 border border-ink-700">
                <p className="text-parchment-500 text-[10px] uppercase">FINAL LECTURE DATE</p>
                <p className="text-parchment-100 font-bold mt-0.5">
                  {dayjs(forecast.endDate).format("MMM D, YYYY")}
                </p>
              </div>
              <div className="p-2.5 rounded-sm bg-ink-900 border border-ink-700 col-span-2 sm:col-span-1">
                <p className="text-parchment-500 text-[10px] uppercase">TODAY'S TARGET</p>
                <p className="text-gold-400 font-bold mt-0.5">
                  1 Lecture (Lec 1)
                </p>
              </div>
            </div>

            {/* Upcoming sample preview */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-parchment-500">
                SAMPLE INITIAL SCHEDULE:
              </p>
              <div className="space-y-1">
                {forecast.schedulePreview.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-sm text-xs font-mono border ${
                      item.isToday
                        ? "bg-gold-500/15 border-gold-500/40 text-gold-300 font-bold"
                        : "bg-ink-900/60 border-ink-700 text-parchment-300"
                    }`}
                  >
                    <span>{item.name}</span>
                    <span>
                      {dayjs(item.date).format("ddd, MMM D")} {item.isToday ? "(TODAY)" : ""}
                    </span>
                  </div>
                ))}
                {forecast.totalCount > 7 && (
                  <p className="text-center text-[10px] font-mono text-parchment-500 pt-1">
                    + {forecast.totalCount - 7} more lectures distributed automatically up to {dayjs(forecast.endDate).format("MMM D, YYYY")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Deploy Button */}
          <div className="pt-2">
            <Button
              onClick={handleDeploy}
              disabled={deploying || !subjectId}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <FiZap size={18} />
              {deploying
                ? "DEPLOYING SCHEDULE..."
                : `DEPLOY ALL ${totalLectures} LECTURES INTO SPACED TIMELINE (1/DAY)`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useData } from "../../context/DataContext";
import Button from "../ui/Button";
import { FiSave, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const PRIORITIES = ["Low", "Medium", "High"];

const initialState = {
  subjectId: "",
  lectureName: "",
  course: "",
  faculty: "",
  completedDate: dayjs().format("YYYY-MM-DD"),
  difficulty: "Medium",
  priority: "Medium",
  notes: "",
};

export default function LectureForm({ onSaved }) {
  const { addLecture, settings, subjects } = useData();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [justSaved, setJustSaved] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  useEffect(() => {
    if (form.subjectId && subjects.some((subject) => subject.id === form.subjectId)) return;
    setForm((current) => ({ ...current, subjectId: subjects[0]?.id || "" }));
  }, [form.subjectId, subjects]);

  const validate = () => {
    const next = {};
    if (!form.subjectId) next.subjectId = "Pick a subject";
    if (!form.completedDate) next.completedDate = "Pick a date";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const lecture = addLecture(form);
    setJustSaved(true);
    setForm({ ...initialState, subjectId: form.subjectId });
    setTimeout(() => setJustSaved(false), 2200);
    onSaved?.(lecture);
  };

  const revisionCount = settings.intervals.length - 1;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-text">Subject</label>
          <select className="input-field" value={form.subjectId} onChange={update("subjectId")} disabled={subjects.length === 0}>
            {subjects.length === 0 ? (
              <option value="">Add a subject first</option>
            ) : subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
          {errors.subjectId && <p className="mt-1.5 text-xs text-rust-300">{errors.subjectId}</p>}
          {subjects.length === 0 && (
            <Link to="/subjects" className="inline-block mt-2 text-xs text-gold-400 hover:text-gold-300">
              Manage subjects →
            </Link>
          )}
        </div>
        <div>
          <label className="label-text">Date completed</label>
          <input type="date" className="input-field" value={form.completedDate} onChange={update("completedDate")} max={dayjs().format("YYYY-MM-DD")} />
          {errors.completedDate && <p className="mt-1.5 text-xs text-rust-300">{errors.completedDate}</p>}
        </div>
      </div>

      <div>
        <label className="label-text">Lecture name <span className="normal-case text-parchment-500/70">(optional)</span></label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. Fundamental Rights — Articles 12 to 35"
          value={form.lectureName}
          onChange={update("lectureName")}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-text">Course name <span className="normal-case text-parchment-500/70">(optional)</span></label>
          <input type="text" className="input-field" placeholder="e.g. Unacademy Polity Foundation" value={form.course} onChange={update("course")} />
        </div>
        <div>
          <label className="label-text">Faculty name <span className="normal-case text-parchment-500/70">(optional)</span></label>
          <input type="text" className="input-field" placeholder="e.g. M. Puri" value={form.faculty} onChange={update("faculty")} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-text">Difficulty</label>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                type="button"
                key={d}
                onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  form.difficulty === d
                    ? "bg-gold-500 text-ink-950 border-gold-500"
                    : "bg-ink-900 border-ink-600 text-parchment-300 hover:border-ink-500"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label-text">Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setForm((f) => ({ ...f, priority: p }))}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                  form.priority === p
                    ? "bg-teal-500 text-ink-950 border-teal-500"
                    : "bg-ink-900 border-ink-600 text-parchment-300 hover:border-ink-500"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="label-text">Notes <span className="normal-case text-parchment-500/70">(optional)</span></label>
        <textarea
          className="input-field min-h-[90px] resize-y"
          placeholder="Key points, doubts to clear, references…"
          value={form.notes}
          onChange={update("notes")}
        />
      </div>

      <div className="flex items-center gap-3 bg-ink-900 border border-ink-600 rounded-xl px-4 py-3">
        <FiZap className="text-gold-400 shrink-0" size={16} />
        <p className="text-xs text-parchment-500">
          Saving will automatically schedule <span className="text-parchment-300 font-medium">{revisionCount} revisions</span> for this lecture — no dates to set manually.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" icon={FiSave} disabled={subjects.length === 0}>Save lecture</Button>
        {justSaved && (
          <span className="text-sm text-teal-300 animate-fadeUp">
            Saved — revisions scheduled ✓
          </span>
        )}
      </div>
    </form>
  );
}

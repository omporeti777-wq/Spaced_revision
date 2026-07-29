import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { useData } from "../context/DataContext";
import Card from "../components/ui/Card";
import { DifficultyBadge, PriorityBadge } from "../components/ui/Badge";
import { friendlyDate } from "../utils/dateHelpers";

export default function SubjectDetail() {
  const { subjectId } = useParams();
  const { lectures, tasks, deleteLecture, subjects } = useData();

  const subjectMeta = subjects.find((subject) => subject.id === subjectId);
  const subjectName = subjectMeta?.name;

  const subjectLectures = useMemo(
    () => lectures.filter((lecture) => lecture.subjectId === subjectId),
    [lectures, subjectId]
  );

  const tasksByLecture = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      map[t.lectureId] = map[t.lectureId] || [];
      map[t.lectureId].push(t);
    });
    return map;
  }, [tasks]);

  if (!subjectMeta) {
    return <p className="text-parchment-500">Unknown subject.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="animate-fadeUp">
        <Link to="/subjects" className="inline-flex items-center gap-1.5 text-xs text-parchment-500 hover:text-parchment-100 mb-3">
          <FiArrowLeft size={14} /> All subjects
        </Link>
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full" style={{ background: subjectMeta.color }} />
          <h1 className="text-2xl font-display font-semibold text-parchment-50">{subjectName}</h1>
        </div>
        <p className="text-sm text-parchment-500 mt-1">{subjectLectures.length} lecture{subjectLectures.length !== 1 ? "s" : ""} logged</p>
      </div>

      {subjectLectures.length === 0 ? (
        <Card className="p-8 text-center animate-fadeUp">
          <p className="text-sm text-parchment-500">No lectures logged for {subjectName} yet.</p>
          <Link to="/add-lecture" className="text-xs text-gold-400 hover:text-gold-300 font-medium mt-2 inline-block">Add one now →</Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {subjectLectures.map((l, i) => {
            const lectureTasks = (tasksByLecture[l.id] || []).sort((a, b) => a.revisionNumber - b.revisionNumber);
            const completed = lectureTasks.filter((t) => t.completed).length;
            const pct = lectureTasks.length ? Math.round((completed / lectureTasks.length) * 100) : 0;

            return (
              <Card key={l.id} className="p-5 sm:p-6 animate-fadeUp" style={{ animationDelay: `${i * 40}ms` }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-parchment-100">{l.lectureName}</p>
                    <p className="text-xs text-parchment-500 mt-1">
                      {l.course && `${l.course} · `}{l.faculty && `${l.faculty} · `}Learned {friendlyDate(l.completedDate)}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <DifficultyBadge difficulty={l.difficulty} />
                      <PriorityBadge priority={l.priority} />
                    </div>
                  </div>
                  <button
                    onClick={() => deleteLecture(l.id)}
                    className="text-parchment-500 hover:text-rust-400 transition-colors shrink-0 p-2 -m-2"
                    title="Delete lecture and its revisions"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-parchment-500 mb-1.5">
                    <span>{completed}/{lectureTasks.length} revisions completed</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: subjectMeta.color }} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {lectureTasks.map((t) => (
                    <span
                      key={t.id}
                      className={`text-[11px] px-2.5 py-1 rounded-full border ${
                        t.completed
                          ? "bg-teal-500/10 text-teal-300 border-teal-500/20"
                          : t.status === "overdue"
                          ? "bg-rust-500/10 text-rust-300 border-rust-500/25"
                          : "bg-ink-700 text-parchment-400 border-ink-600"
                      }`}
                    >
                      {t.label} · {friendlyDate(t.date)}
                    </span>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

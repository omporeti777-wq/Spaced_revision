import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiBookOpen,
  FiChevronDown,
  FiChevronRight,
  FiChevronUp,
  FiEdit2,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import { useData } from "../context/DataContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

const DEFAULT_COLOR = "#4FA89B";

export default function Subjects() {
  const {
    lectures,
    tasks,
    subjects,
    addSubject,
    updateSubject,
    deleteSubject,
    reorderSubjects,
  } = useData();
  const [editor, setEditor] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [draft, setDraft] = useState({ name: "", color: DEFAULT_COLOR });
  const [formError, setFormError] = useState("");

  const subjectStats = useMemo(() => subjects.map((subject) => {
    const subjectLectures = lectures.filter((lecture) => lecture.subjectId === subject.id);
    const subjectTasks = tasks.filter((task) => task.subjectId === subject.id);
    const completed = subjectTasks.filter((task) => task.completed).length;
    const pct = subjectTasks.length ? Math.round((completed / subjectTasks.length) * 100) : 0;
    return { ...subject, lectureCount: subjectLectures.length, taskCount: subjectTasks.length, completed, pct };
  }), [lectures, subjects, tasks]);

  const openCreate = () => {
    setEditor("create");
    setDraft({ name: "", color: DEFAULT_COLOR });
    setFormError("");
  };

  const openEdit = (subject) => {
    setEditor(subject);
    setDraft({ name: subject.name, color: subject.color });
    setFormError("");
  };

  const closeEditor = () => {
    setEditor(null);
    setFormError("");
  };

  const submitSubject = (event) => {
    event.preventDefault();
    try {
      if (editor === "create") addSubject(draft);
      else updateSubject(editor.id, draft);
      closeEditor();
    } catch (error) {
      setFormError(error.message || "Unable to save this subject.");
    }
  };

  const moveSubject = (subjectId, direction) => {
    const currentIndex = subjects.findIndex((subject) => subject.id === subjectId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= subjects.length) return;
    const orderedIds = subjects.map((subject) => subject.id);
    [orderedIds[currentIndex], orderedIds[nextIndex]] = [orderedIds[nextIndex], orderedIds[currentIndex]];
    reorderSubjects(orderedIds);
  };

  const subjectDeletionStats = subjectToDelete && subjectStats.find((subject) => subject.id === subjectToDelete.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fadeUp">
        <div>
          <h1 className="text-2xl font-display font-semibold text-parchment-50">Manage subjects</h1>
          <p className="text-sm text-parchment-500 mt-1">Create, arrange, and maintain the subjects used across your tracker.</p>
        </div>
        <Button icon={FiPlus} onClick={openCreate}>Add subject</Button>
      </div>

      {subjectStats.length === 0 ? (
        <Card className="flex flex-col items-center text-center py-16 animate-fadeUp">
          <FiBookOpen className="text-parchment-500 mb-3" size={28} />
          <p className="text-sm text-parchment-300">No subjects yet</p>
          <p className="text-xs text-parchment-500 mt-1">Add one to start logging lectures and revisions.</p>
          <Button icon={FiPlus} onClick={openCreate} className="mt-5">Add your first subject</Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjectStats.map((subject, index) => (
            <Card key={subject.id} hover className="p-5 animate-fadeUp h-full" style={{ animationDelay: `${index * 40}ms` }}>
              <div className="flex items-start justify-between gap-3">
                <Link to={`/subjects/${subject.id}`} className="flex min-w-0 items-center gap-2.5 hover:text-gold-300">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: subject.color }} />
                  <p className="font-medium text-parchment-100 truncate">{subject.name}</p>
                </Link>
                <div className="flex items-center -mr-1 -mt-1 shrink-0">
                  <button
                    onClick={() => moveSubject(subject.id, -1)}
                    disabled={index === 0}
                    title="Move subject up"
                    className="p-1.5 text-parchment-500 hover:text-parchment-100 disabled:opacity-25 disabled:hover:text-parchment-500"
                  >
                    <FiChevronUp size={15} />
                  </button>
                  <button
                    onClick={() => moveSubject(subject.id, 1)}
                    disabled={index === subjectStats.length - 1}
                    title="Move subject down"
                    className="p-1.5 text-parchment-500 hover:text-parchment-100 disabled:opacity-25 disabled:hover:text-parchment-500"
                  >
                    <FiChevronDown size={15} />
                  </button>
                </div>
              </div>

              <p className="text-2xl font-display font-semibold text-parchment-50 mt-5">
                {subject.lectureCount} <span className="text-sm font-body font-normal text-parchment-500">lectures</span>
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-parchment-500 mb-1.5">
                  <span>{subject.completed}/{subject.taskCount} revisions done</span>
                  <span>{subject.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${subject.pct}%`, background: subject.color }} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-5 pt-4 border-t border-ink-600">
                <Link to={`/subjects/${subject.id}`} className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-medium">
                  View subject <FiChevronRight size={14} />
                </Link>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(subject)} className="p-2 -m-1 text-parchment-500 hover:text-parchment-100" title={`Edit ${subject.name}`}>
                    <FiEdit2 size={15} />
                  </button>
                  <button onClick={() => setSubjectToDelete(subject)} className="p-2 -m-1 text-parchment-500 hover:text-rust-400" title={`Delete ${subject.name}`}>
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={Boolean(editor)} onClose={closeEditor} title={editor === "create" ? "Add subject" : "Edit subject"}>
        <form onSubmit={submitSubject} className="space-y-5">
          <div>
            <label className="label-text" htmlFor="subject-name">Subject name</label>
            <input
              id="subject-name"
              autoFocus
              className="input-field"
              value={draft.name}
              onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              placeholder="e.g. Modern History"
            />
          </div>
          <div>
            <label className="label-text" htmlFor="subject-color">Subject colour</label>
            <div className="flex items-center gap-3">
              <input
                id="subject-color"
                type="color"
                value={draft.color}
                onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))}
                className="h-10 w-14 rounded-lg border border-ink-600 bg-ink-900 p-1 cursor-pointer"
              />
              <span className="text-xs text-parchment-500">Used in cards, calendars, and charts.</span>
            </div>
          </div>
          {formError && <p className="text-sm text-rust-300">{formError}</p>}
          <div className="flex justify-end gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={closeEditor}>Cancel</Button>
            <Button type="submit">{editor === "create" ? "Add subject" : "Save changes"}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(subjectToDelete)} onClose={() => setSubjectToDelete(null)} title="Delete subject">
        <div className="space-y-5">
          <div className="flex gap-3">
            <FiAlertTriangle className="text-rust-400 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-parchment-300">
              Delete <span className="text-parchment-50 font-medium">{subjectToDelete?.name}</span>? This permanently removes
              {" "}{subjectDeletionStats?.lectureCount || 0} lecture{subjectDeletionStats?.lectureCount === 1 ? "" : "s"} and
              {" "}{subjectDeletionStats?.taskCount || 0} related revision task{subjectDeletionStats?.taskCount === 1 ? "" : "s"}.
            </p>
          </div>
          <p className="text-xs text-parchment-500">This action cannot be undone.</p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setSubjectToDelete(null)}>Cancel</Button>
            <Button
              type="button"
              onClick={() => {
                deleteSubject(subjectToDelete.id);
                setSubjectToDelete(null);
              }}
              className="!bg-rust-500 !text-white hover:!bg-rust-400"
            >
              Delete subject
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

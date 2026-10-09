import { useState, useMemo } from "react";
import dayjs from "dayjs";
import {
  FiBook,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSmile,
  FiCalendar,
  FiClock,
  FiTag,
  FiCheck,
  FiX,
  FiZap,
  FiFilter,
  FiSearch,
  FiEye,
  FiMaximize2,
} from "react-icons/fi";
import { useData } from "../context/DataContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const MOODS = [
  { id: "victorious", label: "VICTORIOUS", icon: "🏆", color: "text-gold-400 bg-gold-500/10 border-gold-500/30" },
  { id: "focused", label: "LOCKED IN", icon: "🎯", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { id: "neutral", label: "CALM / STEADY", icon: "⚖️", color: "text-slate-300 bg-ink-800 border-ink-600" },
  { id: "fatigued", label: "TIRED / LOW ENERGY", icon: "🔋", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { id: "frustrated", label: "STRUGGLING / RESET", icon: "⚡", color: "text-rust-400 bg-rust-500/10 border-rust-500/30" },
];

const PRESET_TAGS = [
  "Answer Writing",
  "Geography",
  "Polity",
  "Current Affairs",
  "Optional",
  "Mindset",
  "Burnout Check",
  "Breakthrough",
];

export default function Diary() {
  const { diaryEntries = [], addDiaryEntry, updateDiaryEntry, deleteDiaryEntry } = useData();

  const [isComposing, setIsComposing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [readingEntry, setReadingEntry] = useState(null); // Full reader modal state
  const [selectedMoodFilter, setSelectedMoodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("focused");
  const [studyHours, setStudyHours] = useState("");
  const [date, setDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState("");

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("focused");
    setStudyHours("");
    setDate(dayjs().format("YYYY-MM-DD"));
    setSelectedTags([]);
    setCustomTagInput("");
    setEditingId(null);
    setIsComposing(false);
  };

  const handleStartEdit = (entry) => {
    setEditingId(entry.id);
    setTitle(entry.title || "");
    setContent(entry.content || "");
    setMood(entry.mood || "focused");
    setStudyHours(entry.studyHours || "");
    setDate(entry.date || dayjs().format("YYYY-MM-DD"));
    setSelectedTags(entry.tags || []);
    setIsComposing(true);
    setReadingEntry(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    const trimmed = customTagInput.trim();
    if (trimmed && !selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed]);
      setCustomTagInput("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    if (editingId) {
      updateDiaryEntry(editingId, {
        title: title.trim() || "Field Journal Log",
        content: content.trim(),
        mood,
        studyHours,
        date,
        tags: selectedTags,
      });
    } else {
      addDiaryEntry({
        title: title.trim() || "Field Journal Log",
        content: content.trim(),
        mood,
        studyHours,
        date,
        tags: selectedTags,
      });
    }
    resetForm();
  };

  const filteredEntries = useMemo(() => {
    return diaryEntries.filter((entry) => {
      const matchesMood = selectedMoodFilter === "all" || entry.mood === selectedMoodFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesMood && matchesSearch;
    });
  }, [diaryEntries, selectedMoodFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-ink-900 border border-ink-600 rounded-sm relative overflow-hidden shadow-tactical">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-gold-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-sm bg-gold-500/15 border border-gold-500/40 text-gold-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,145,0,0.3)]">
            <FiBook size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-gold-400 tracking-widest uppercase">
                // INTEL LOG // FIELD DIARY
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-ink-800 text-parchment-400 border border-ink-600 font-mono">
                {diaryEntries.length} LOGS
              </span>
            </div>
            <h1 className="text-2xl font-display font-black text-parchment-50 tracking-wider uppercase">
              OPERATOR'S FIELD JOURNAL
            </h1>
            <p className="text-xs font-mono text-parchment-400">
              No daily pressure. Write when inspired, read logs anytime in full dossier view.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {!isComposing ? (
            <Button
              variant="primary"
              onClick={() => setIsComposing(true)}
              className="flex items-center gap-2 shadow-glow"
            >
              <FiPlus size={16} />
              <span>RECORD NEW ENTRY</span>
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={resetForm}
              className="flex items-center gap-2"
            >
              <FiX size={16} />
              <span>CANCEL / CLOSE</span>
            </Button>
          )}
        </div>
      </div>

      {/* Entry Composer Form */}
      {isComposing && (
        <Card className="p-6 border-gold-500/60 bg-ink-900/90 shadow-[0_0_20px_rgba(255,145,0,0.15)] relative animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-ink-600/80">
            <div className="flex items-center gap-2">
              <FiZap className="text-gold-400" />
              <h2 className="text-sm font-display font-black text-gold-400 uppercase tracking-widest">
                {editingId ? "MODIFY FIELD LOG" : "TRANSMIT NEW LOG"}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-parchment-500">
              CONFIDENTIAL // OPERATOR EYES ONLY
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-parchment-400 uppercase tracking-wider mb-1">
                  Log Subject / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Breakthrough in Geomorphology / Feeling reset today..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-ink-950 border border-ink-600 rounded-sm px-3 py-2 text-sm text-parchment-100 placeholder-parchment-600 focus:outline-none focus:border-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-parchment-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FiCalendar size={13} />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-ink-950 border border-ink-600 rounded-sm px-3 py-2 text-sm text-parchment-100 focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
            </div>

            {/* Mood / Mental State Selector */}
            <div>
              <label className="block text-xs font-mono text-parchment-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FiSmile size={14} className="text-gold-400" />
                Current Mindset / Combat Mood
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {MOODS.map((m) => {
                  const isSelected = mood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMood(m.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-mono font-bold transition-all ${
                        isSelected
                          ? `${m.color} ring-1 ring-gold-400 shadow-[0_0_10px_rgba(255,145,0,0.25)]`
                          : "bg-ink-950 border-ink-700 text-parchment-400 hover:border-ink-500 hover:text-parchment-200"
                      }`}
                    >
                      <span className="text-base">{m.icon}</span>
                      <span className="truncate">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-xs font-mono text-parchment-400 uppercase tracking-wider mb-1">
                Reflections & Battle Notes
              </label>
              <textarea
                rows={6}
                placeholder="What went well today? What did you struggle with? Any thoughts on your journey, motivation, or syllabus topics? Feel free to write anything..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-ink-950 border border-ink-600 rounded-sm p-3.5 text-sm text-parchment-100 placeholder-parchment-600 focus:outline-none focus:border-gold-500 font-sans leading-relaxed resize-y break-all"
              />
            </div>

            {/* Extra Intel: Study Hours & Quick Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-mono text-parchment-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FiClock size={13} />
                  Hours Put In (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5.5 hrs or 6 hours deep focus"
                  value={studyHours}
                  onChange={(e) => setStudyHours(e.target.value)}
                  className="w-full bg-ink-950 border border-ink-600 rounded-sm px-3 py-2 text-sm text-parchment-100 placeholder-parchment-600 focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-parchment-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FiTag size={13} />
                  Quick Tags
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-[10px] font-mono uppercase px-2 py-1 rounded-sm border transition ${
                          isSelected
                            ? "bg-gold-500 text-ink-950 border-gold-400 font-bold"
                            : "bg-ink-950 text-parchment-400 border-ink-700 hover:border-ink-500"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Custom tag..."
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTag(e);
                      }
                    }}
                    className="flex-1 bg-ink-950 border border-ink-600 rounded-sm px-2 py-1 text-xs text-parchment-200 placeholder-parchment-600 focus:outline-none focus:border-gold-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-2.5 py-1 text-xs font-mono bg-ink-800 border border-ink-600 text-parchment-200 hover:bg-ink-700 rounded-sm"
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink-700">
              <Button type="button" variant="ghost" onClick={resetForm}>
                CANCEL
              </Button>
              <Button type="submit" variant="primary" className="shadow-glow px-6">
                <FiCheck className="mr-1.5" />
                {editingId ? "SAVE CHANGES" : "TRANSMIT LOG TO DIARY"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-ink-900 border border-ink-600 rounded-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <FiFilter size={14} className="text-gold-400 shrink-0 ml-1" />
          <button
            onClick={() => setSelectedMoodFilter("all")}
            className={`text-xs font-mono uppercase px-2.5 py-1 rounded-sm border whitespace-nowrap transition ${
              selectedMoodFilter === "all"
                ? "bg-gold-500 text-ink-950 border-gold-500 font-bold"
                : "bg-ink-950 text-parchment-400 border-ink-700 hover:text-parchment-200"
            }`}
          >
            ALL LOGS ({diaryEntries.length})
          </button>
          {MOODS.map((m) => {
            const count = diaryEntries.filter((e) => e.mood === m.id).length;
            if (count === 0 && selectedMoodFilter !== m.id) return null;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMoodFilter(m.id)}
                className={`text-xs font-mono uppercase px-2.5 py-1 rounded-sm border whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedMoodFilter === m.id
                    ? `${m.color} ring-1 ring-gold-400 font-bold`
                    : "bg-ink-950 text-parchment-400 border-ink-700 hover:text-parchment-200"
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label} ({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px]">
          <FiSearch className="absolute left-3 top-2.5 text-parchment-500 text-xs" />
          <input
            type="text"
            placeholder="Search diary notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-ink-950 border border-ink-600 rounded-sm pl-8 pr-3 py-1.5 text-xs text-parchment-100 placeholder-parchment-600 focus:outline-none focus:border-gold-500 font-mono"
          />
        </div>
      </div>

      {/* Diary Entries Grid / Compact List */}
      {filteredEntries.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-ink-600 bg-ink-900/50">
          <div className="w-14 h-14 mx-auto rounded-full bg-ink-800 border border-ink-600 text-parchment-500 flex items-center justify-center mb-4">
            <FiBook size={24} />
          </div>
          <h3 className="text-base font-display font-bold text-parchment-200 uppercase tracking-wide">
            {diaryEntries.length === 0
              ? "NO FIELD ENTRIES LOGGED YET"
              : "NO LOGS MATCHING YOUR SEARCH"}
          </h3>
          <p className="text-xs font-mono text-parchment-400 max-w-md mx-auto mt-1 mb-6">
            {diaryEntries.length === 0
              ? "Whenever you feel like writing down your study thoughts, mental state, or insights, click below to record an entry."
              : "Try clearing your mood filter or search query to view all journal entries."}
          </p>
          {diaryEntries.length === 0 && (
            <Button variant="primary" onClick={() => setIsComposing(true)}>
              <FiPlus className="mr-1.5" />
              CREATE FIRST JOURNAL LOG
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => {
            const moodObj = MOODS.find((m) => m.id === entry.mood) || MOODS[1];
            const isLong = (entry.content || "").length > 180;

            return (
              <Card
                key={entry.id}
                className="p-5 border-ink-600 bg-ink-900/80 hover:border-gold-500/50 transition-all group flex flex-col justify-between shadow-tactical overflow-hidden"
              >
                <div className="min-w-0">
                  {/* Top Header of Card */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded-sm border flex items-center gap-1 font-bold ${moodObj.color}`}>
                        <span>{moodObj.icon}</span>
                        <span>{moodObj.label}</span>
                      </span>

                      {entry.studyHours && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-ink-800 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                          <FiClock size={11} />
                          {entry.studyHours}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-parchment-500 text-xs font-mono">
                      <FiCalendar size={12} />
                      <span>{dayjs(entry.date).format("DD MMM YYYY")}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-display font-black text-parchment-100 tracking-wide uppercase mb-2 group-hover:text-gold-400 transition-colors truncate">
                    {entry.title}
                  </h3>

                  {/* Clean Snippet Preview (Clamped & wrapping properly) */}
                  <div className="relative mb-3 bg-ink-950/60 p-3 rounded border border-ink-800">
                    <p className="text-xs text-parchment-300 font-sans leading-relaxed line-clamp-4 break-words whitespace-pre-wrap overflow-hidden">
                      {entry.content}
                    </p>

                    {isLong && (
                      <button
                        type="button"
                        onClick={() => setReadingEntry(entry)}
                        className="mt-2 text-[11px] font-mono font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1 transition"
                      >
                        <FiEye size={12} />
                        <span>READ FULL LOG →</span>
                      </button>
                    )}
                  </div>

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {entry.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-ink-800/80 border border-ink-700 text-parchment-400 truncate max-w-[120px]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-ink-800 text-xs font-mono mt-2">
                  <button
                    onClick={() => setReadingEntry(entry)}
                    className="text-[11px] text-parchment-400 hover:text-parchment-100 flex items-center gap-1 transition"
                    title="View Full Log"
                  >
                    <FiMaximize2 size={12} className="text-gold-400" />
                    <span>VIEW</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(entry)}
                      className="p-1.5 text-parchment-400 hover:text-gold-400 hover:bg-ink-800 rounded transition"
                      title="Edit this log"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this field entry permanently?")) {
                          deleteDiaryEntry(entry.id);
                        }
                      }}
                      className="p-1.5 text-parchment-400 hover:text-rust-400 hover:bg-ink-800 rounded transition"
                      title="Delete log"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* FULL ENTRY READER / DOSSIER MODAL */}
      {readingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-ink-900 border-2 border-gold-500/80 rounded-sm shadow-[0_0_30px_rgba(255,145,0,0.25)] flex flex-col max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-ink-700 bg-ink-950/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {(() => {
                  const mObj = MOODS.find((m) => m.id === readingEntry.mood) || MOODS[1];
                  return (
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-sm border flex items-center gap-1 font-bold ${mObj.color}`}>
                      <span>{mObj.icon}</span>
                      <span>{mObj.label}</span>
                    </span>
                  );
                })()}

                <span className="text-xs font-mono text-parchment-400">
                  {dayjs(readingEntry.date).format("DD MMMM YYYY")}
                </span>

                {readingEntry.studyHours && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-sm bg-ink-800 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
                    <FiClock size={11} />
                    {readingEntry.studyHours}
                  </span>
                )}
              </div>

              <button
                onClick={() => setReadingEntry(null)}
                className="p-1.5 text-parchment-400 hover:text-parchment-100 hover:bg-ink-800 rounded transition"
                title="Close viewer"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] font-mono text-gold-400 tracking-widest uppercase block mb-1">
                  // DECLASSIFIED DOSSIER LOG
                </span>
                <h2 className="text-2xl font-display font-black text-parchment-50 uppercase tracking-wide break-words">
                  {readingEntry.title}
                </h2>
              </div>

              {/* Tags in Modal */}
              {readingEntry.tags && readingEntry.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {readingEntry.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-sm bg-ink-800 border border-ink-700 text-parchment-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Full Content with clean word-break */}
              <div className="bg-ink-950/80 p-5 rounded border border-ink-800 text-parchment-100 font-sans text-sm leading-relaxed whitespace-pre-wrap break-words">
                {readingEntry.content}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-ink-700 bg-ink-950/60 flex items-center justify-between">
              <span className="text-xs font-mono text-parchment-500">
                RECORDED: {dayjs(readingEntry.createdAt).format("DD MMM YYYY, hh:mm A")}
              </span>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleStartEdit(readingEntry)}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <FiEdit2 size={13} />
                  <span>EDIT ENTRY</span>
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setReadingEntry(null)}
                  className="text-xs px-5"
                >
                  DONE
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

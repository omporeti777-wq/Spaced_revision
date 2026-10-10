import { useState } from "react";
import {
  FiCloud,
  FiPlus,
  FiTrash2,
  FiRotateCcw,
  FiSave,
  FiAlertTriangle,
  FiCheck,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { useData } from "../context/DataContext";
import { DEFAULT_INTERVALS } from "../data/defaultSettings";
import { isSupabaseConfigured } from "../services/cloud/supabaseRest";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

export default function Settings() {
  const {
    settings,
    updateSettings,
    clearAllData,
    lectures = [],
    tasks = [],
    personalTasks = [],
    diaryEntries = [],
  } = useData();

  const [intervals, setIntervals] = useState(settings.intervals || DEFAULT_INTERVALS);
  const [newDay, setNewDay] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const cloudConfigured = isSupabaseConfigured();

  // Reset Modal state
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const totalItemCount =
    lectures.length + tasks.length + personalTasks.length + diaryEntries.length;

  const addInterval = () => {
    const day = parseInt(newDay, 10);
    if (Number.isNaN(day) || day <= (intervals[intervals.length - 1] ?? -1)) {
      setError("Enter a day number greater than the last interval.");
      return;
    }
    setIntervals((prev) => [...prev, day]);
    setNewDay("");
    setError("");
  };

  const removeInterval = (index) => {
    if (index === 0) return; // Day 0 (Learn) is fixed
    setIntervals((prev) => prev.filter((_, i) => i !== index));
  };

  const resetDefaults = () => setIntervals(DEFAULT_INTERVALS);

  const save = () => {
    updateSettings({ intervals });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExecuteReset = async () => {
    if (confirmText.trim().toUpperCase() !== "RESET") return;
    setIsResetting(true);
    try {
      await clearAllData();
      setResetModalOpen(false);
      setConfirmText("");
      // Reload page to start with a fresh slate
      window.location.href = "/";
    } catch (err) {
      console.error("Reset error:", err);
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between pb-2 border-b border-ink-600/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-gold-400 uppercase tracking-widest">
              // SYS CONFIG
            </span>
          </div>
          <h1 className="text-2xl font-display font-black text-parchment-50 uppercase tracking-wide">
            SYSTEM SETTINGS
          </h1>
          <p className="text-xs font-mono text-parchment-400 mt-0.5">
            Configure spaced repetition intervals, cloud sync, and operational slate resets.
          </p>
        </div>
      </div>

      {/* REVISION INTERVALS */}
      <Card className="p-6 hud-bracket border border-ink-600 bg-ink-900/90 shadow-tactical">
        <div className="flex items-center justify-between mb-1 pb-3 border-b border-ink-700">
          <div className="flex items-center gap-2">
            <FiZap className="text-gold-400" size={16} />
            <h2 className="font-display font-bold text-base text-parchment-50 uppercase tracking-wider">
              SPACED REVISION INTERVALS
            </h2>
          </div>
          <button
            onClick={resetDefaults}
            className="flex items-center gap-1.5 text-xs font-mono text-parchment-400 hover:text-gold-400 transition"
          >
            <FiRotateCcw size={12} /> RESTORE DEFAULTS
          </button>
        </div>
        <p className="text-xs font-mono text-parchment-400 mb-5">
          Days after learning that revisions are scheduled. Only future lecture logs use updated intervals.
        </p>

        <div className="space-y-2">
          {intervals.map((day, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-ink-950 border border-ink-700 rounded-sm px-4 py-2.5"
            >
              <span className="w-8 h-8 rounded-sm bg-ink-800 border border-ink-600 flex items-center justify-center text-xs font-mono font-bold text-gold-400 shrink-0">
                {i === 0 ? "L0" : `R${i}`}
              </span>
              <div className="flex-1">
                <p className="text-xs font-display font-bold text-parchment-100 uppercase tracking-wide">
                  {i === 0 ? "Primary Study (Day 0)" : `Revision Phase ${i}`}
                </p>
                <p className="text-[11px] text-parchment-500 font-mono">
                  Triggered at +{day} days
                </p>
              </div>
              {i !== 0 && (
                <button
                  onClick={() => removeInterval(i)}
                  className="text-parchment-500 hover:text-rust-400 p-1.5 transition"
                  title="Remove interval"
                >
                  <FiTrash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <input
            type="number"
            min={(intervals[intervals.length - 1] ?? 0) + 1}
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            placeholder={`e.g. ${(intervals[intervals.length - 1] ?? 0) + 15}`}
            className="bg-ink-950 border border-ink-600 rounded-sm px-3 py-2 text-xs font-mono text-parchment-100 placeholder-ink-500 flex-1 focus:outline-none focus:border-gold-500"
          />
          <Button variant="secondary" icon={FiPlus} onClick={addInterval} type="button">
            ADD INTERVAL
          </Button>
        </div>
        {error && <p className="text-xs font-mono text-rust-400 mt-2">{error}</p>}

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-ink-700">
          <Button icon={FiSave} onClick={save} variant="primary" className="shadow-glow">
            SAVE SCHEDULE
          </Button>
          {saved && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
              <FiCheck /> SCHEDULE UPDATED
            </span>
          )}
        </div>
      </Card>

      {/* CLOUD SYNC STATUS */}
      <Card className="p-6 hud-bracket border border-ink-600 bg-ink-900/90 shadow-tactical">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-sm bg-ink-950 border border-ink-700 flex items-center justify-center shrink-0">
            <FiCloud
              className={cloudConfigured ? "text-cyan-400" : "text-parchment-500"}
              size={20}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-parchment-50 uppercase tracking-wider">
                CLOUD SYNC STATUS
              </h2>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${
                  cloudConfigured
                    ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
                    : "text-rust-400 border-rust-500/40 bg-rust-500/10"
                }`}
              >
                {cloudConfigured ? "CONNECTED" : "OFFLINE ONLY"}
              </span>
            </div>
            <p className="text-xs font-mono text-parchment-400 mt-1 leading-relaxed">
              {cloudConfigured
                ? "Supabase cloud sync is active. All lectures, spaced revisions, personal directives, and field diary entries are backed up and synchronized across all your devices."
                : "Local storage only. Configure Supabase in .env to enable multi-device sync."}
            </p>
          </div>
        </div>
      </Card>

      {/* COMPLETE MISSION PURGE / START PREPARATION FROM SCRATCH */}
      <Card className="p-6 hud-bracket border-2 border-rust-500/60 bg-rust-500/5 shadow-[0_0_20px_rgba(239,68,68,0.15)] relative">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-sm bg-rust-500/20 border border-rust-500 text-rust-400 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={20} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-rust-400 tracking-widest uppercase bg-rust-500/20 px-1.5 py-0.2 rounded border border-rust-500/40">
                CRITICAL DIRECTIVE // DECLASSIFY & RESET
              </span>
            </div>

            <h2 className="font-display font-black text-lg text-parchment-50 uppercase tracking-wide mt-1">
              RESTART PREPARATION FROM THE BEGINNING
            </h2>

            <p className="text-xs font-mono text-parchment-300 mt-1 leading-relaxed">
              Want to start your UPSC mission completely fresh with full focus? This will clear all recorded lectures, revision schedules, personal tasks, and diary logs from both your browser and Supabase cloud.
            </p>

            <div className="mt-3 p-3 bg-ink-950/80 rounded border border-ink-700 text-xs font-mono text-parchment-400 flex items-center justify-between">
              <span>CURRENT SYSTEM RECORDS DETECTED:</span>
              <span className="text-gold-400 font-bold">
                {lectures.length} LECTURES · {tasks.length} REVISIONS · {personalTasks.length} TASKS · {diaryEntries.length} LOGS
              </span>
            </div>

            <div className="mt-5">
              <Button
                variant="danger"
                icon={FiTrash2}
                onClick={() => {
                  setConfirmText("");
                  setResetModalOpen(true);
                }}
                className="bg-rust-600 hover:bg-rust-500 text-ink-950 font-bold uppercase tracking-wider shadow-glowRed"
              >
                CLEAR ALL DATA & RESTART FROM ZERO
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* CONFIRMATION SAFETY MODAL */}
      <Modal
        open={resetModalOpen}
        onClose={() => !isResetting && setResetModalOpen(false)}
        title="⚠️ CONFIRM MISSION SLATE PURGE"
      >
        <div className="space-y-4">
          <div className="p-4 bg-rust-500/15 border border-rust-500/60 rounded text-rust-300 text-xs font-mono space-y-2">
            <p className="font-bold uppercase tracking-wider text-rust-400 flex items-center gap-1.5">
              <FiAlertTriangle /> WARNING: THIS ACTION CANNOT BE UNDONE
            </p>
            <p>
              You are about to completely wipe:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-parchment-300 pl-1">
              <li>{lectures.length} Recorded lectures</li>
              <li>{tasks.length} Spaced revision intervals</li>
              <li>{personalTasks.length} Tactical tasks</li>
              <li>{diaryEntries.length} Field diary entries</li>
            </ul>
            <p className="text-[11px] text-parchment-400 pt-1">
              Your preparation will start totally fresh from Day 1.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-parchment-300 uppercase tracking-wider">
              Type <span className="text-rust-400 font-bold">RESET</span> below to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type RESET here..."
              autoFocus
              className="w-full bg-ink-950 border border-ink-600 rounded-sm px-3 py-2 text-sm font-mono text-rust-400 placeholder-ink-600 uppercase focus:outline-none focus:border-rust-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-ink-700">
            <Button
              type="button"
              variant="ghost"
              disabled={isResetting}
              onClick={() => setResetModalOpen(false)}
            >
              ABORT / CANCEL
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={confirmText.trim().toUpperCase() !== "RESET" || isResetting}
              onClick={handleExecuteReset}
              className="bg-rust-600 hover:bg-rust-500 font-bold uppercase tracking-wider"
            >
              {isResetting ? "PURGING DATA..." : "CONFIRM PURGE & RESTART"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

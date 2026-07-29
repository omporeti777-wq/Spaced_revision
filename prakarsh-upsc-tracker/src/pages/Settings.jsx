import { useState } from "react";
import { FiCloud, FiPlus, FiTrash2, FiRotateCcw, FiSave } from "react-icons/fi";
import { useData } from "../context/DataContext";
import { DEFAULT_INTERVALS } from "../data/defaultSettings";
import { STORAGE_KEYS } from "../utils/storage";
import { isSupabaseConfigured } from "../services/cloud/supabaseRest";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Settings() {
  const { settings, updateSettings } = useData();
  const [intervals, setIntervals] = useState(settings.intervals);
  const [newDay, setNewDay] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const cloudConfigured = isSupabaseConfigured();

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-display font-semibold text-parchment-50">Settings</h1>
        <p className="text-sm text-parchment-500 mt-1">Tune the spaced-repetition schedule to match how you retain material.</p>
      </div>

      <Card className="p-6 sm:p-8 animate-fadeUp" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg text-parchment-50">Revision intervals</h2>
          <button onClick={resetDefaults} className="flex items-center gap-1.5 text-xs text-parchment-500 hover:text-parchment-100">
            <FiRotateCcw size={13} /> Reset to default
          </button>
        </div>
        <p className="text-xs text-parchment-500 mb-5">
          Days after learning that a revision should be scheduled. Only future lectures use updated intervals — past
          schedules stay untouched.
        </p>

        <div className="space-y-2.5">
          {intervals.map((day, i) => (
            <div key={i} className="flex items-center gap-3 bg-ink-900 border border-ink-600 rounded-xl px-4 py-3">
              <span className="w-7 h-7 rounded-lg bg-ink-700 flex items-center justify-center text-xs font-mono text-parchment-300 shrink-0">
                {i === 0 ? "L" : `R${i}`}
              </span>
              <div className="flex-1">
                <p className="text-sm text-parchment-100">{i === 0 ? "Learn (Day 0)" : `Revision ${i}`}</p>
                <p className="text-xs text-parchment-500 font-mono">Day {day}</p>
              </div>
              {i !== 0 && (
                <button onClick={() => removeInterval(i)} className="text-parchment-500 hover:text-rust-400 p-1.5 -m-1.5">
                  <FiTrash2 size={15} />
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
            className="input-field flex-1"
          />
          <Button variant="secondary" icon={FiPlus} onClick={addInterval} type="button">Add day</Button>
        </div>
        {error && <p className="text-xs text-rust-400 mt-2">{error}</p>}

        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-ink-600">
          <Button icon={FiSave} onClick={save}>Save schedule</Button>
          {saved && <span className="text-sm text-teal-300 animate-fadeUp">Saved ✓</span>}
        </div>
      </Card>

      <Card className="p-6 sm:p-8 animate-fadeUp" style={{ animationDelay: "140ms" }}>
        <div className="flex items-start gap-3">
          <FiCloud className={cloudConfigured ? "text-teal-300 mt-0.5" : "text-parchment-500 mt-0.5"} size={18} />
          <div>
            <h2 className="font-display text-lg text-parchment-50">Cloud sync</h2>
            {cloudConfigured ? (
              <p className="text-xs text-parchment-500 mt-1">Supabase is configured. Secure cloud sync will activate after Phase 4 adds sign-in, so every request is protected by your user account.</p>
            ) : (
              <p className="text-xs text-parchment-500 mt-1">Not configured yet. Copy <code className="text-parchment-300">.env.example</code> to <code className="text-parchment-300">.env.local</code>, then add your Supabase URL and publishable key. The database migration is in <code className="text-parchment-300">supabase/migrations</code>.</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 sm:p-8 animate-fadeUp" style={{ animationDelay: "180ms" }}>
        <h2 className="font-display text-lg text-parchment-50 mb-2">Data</h2>
        <p className="text-xs text-parchment-500 mb-4">
          Everything — lectures, tasks and settings — lives in this browser's local storage. Nothing is sent anywhere.
        </p>
        <Button
          variant="secondary"
          icon={FiTrash2}
          onClick={() => {
            if (confirm("This will permanently erase all lectures, revisions and settings. Continue?")) {
              Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
              window.location.reload();
            }
          }}
        >
          Clear all data
        </Button>
      </Card>
    </div>
  );
}

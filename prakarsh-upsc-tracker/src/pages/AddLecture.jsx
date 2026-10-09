import { useState } from "react";
import { FiPlusCircle, FiZap } from "react-icons/fi";
import Card from "../components/ui/Card";
import LectureForm from "../components/lecture/LectureForm";
import BacklogCatchupWizard from "../components/lecture/BacklogCatchupWizard";

export default function AddLecture() {
  const [activeTab, setActiveTab] = useState("backlog"); // "single" | "backlog"
  const [lastSaved, setLastSaved] = useState(null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-sm border-2 border-gold-500/60 bg-ink-900/90 shadow-glow animate-fadeUp">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-gold-400 uppercase">
            // INTEL ACQUISITION PROTOCOL
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-parchment-50 uppercase tracking-wide">
          LOG SYLLABUS INTEL
        </h1>
        <p className="text-xs sm:text-sm font-tactical text-parchment-300 mt-1">
          Log individual lectures as you study, or use the Backlog Wizard to schedule completed series (like Geography 40 lectures) at 1 lecture per day.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 animate-fadeUp">
        <button
          onClick={() => setActiveTab("backlog")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all ${
            activeTab === "backlog"
              ? "bg-gold-500 text-ink-950 border-gold-500 shadow-glow font-black"
              : "bg-ink-800 border-ink-600 text-parchment-300 hover:text-parchment-50 hover:border-gold-500"
          }`}
        >
          <FiZap size={14} className={activeTab === "backlog" ? "text-ink-950" : "text-gold-400"} />
          ⚡ BACKLOG CATCHUP WIZARD (PACED RE-LEARN)
        </button>

        <button
          onClick={() => setActiveTab("single")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-display font-bold uppercase tracking-wider border transition-all ${
            activeTab === "single"
              ? "bg-gold-500 text-ink-950 border-gold-500 shadow-glow font-black"
              : "bg-ink-800 border-ink-600 text-parchment-300 hover:text-parchment-50 hover:border-gold-500"
          }`}
        >
          <FiPlusCircle size={14} />
          SINGLE LECTURE LOG
        </button>
      </div>

      {/* Tab Panels */}
      <Card className="p-6 sm:p-8 hud-bracket border border-gold-500/30 animate-fadeUp">
        {activeTab === "backlog" ? (
          <BacklogCatchupWizard onDeployed={(lectures) => setLastSaved(lectures[0])} />
        ) : (
          <div className="space-y-4">
            <div className="border-b border-ink-700 pb-3 mb-4">
              <h2 className="text-sm font-display font-bold uppercase tracking-wider text-parchment-100 flex items-center gap-2">
                <FiPlusCircle className="text-gold-400" /> SINGLE LECTURE RECON LOG
              </h2>
              <p className="text-xs font-mono text-parchment-400 mt-0.5">
                Record a single lecture you watched today. Full spaced intervals (R1-R5) will generate automatically.
              </p>
            </div>
            <LectureForm onSaved={setLastSaved} />
          </div>
        )}
      </Card>

      {lastSaved && activeTab === "single" && (
        <Card className="p-5 animate-fadeUp border-teal-500/40 bg-teal-500/10">
          <p className="text-xs font-mono text-teal-300">
            ✓ INTEL SAVED: <span className="font-bold text-parchment-50">{lastSaved.lectureName}</span> (Sector: {lastSaved.subject}). Spaced intervals are now live on your Calendar and Mission Control!
          </p>
        </Card>
      )}
    </div>
  );
}

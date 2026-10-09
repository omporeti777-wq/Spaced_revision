import { FiPlus } from "react-icons/fi";
import Button from "../ui/Button";

export default function TaskHeader({ onNewTask, showForm }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-sm border border-gold-500/40 bg-ink-900/90 shadow-glow animate-fadeUp">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-gold-400" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-gold-400 uppercase">
            // OPERATIONAL DIRECTIVES
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-parchment-50 uppercase tracking-wide">
          TACTICAL STUDY TASKS
        </h1>
        <p className="text-xs sm:text-sm font-tactical text-parchment-300 mt-1">
          Track syllabus targets, editorial reading, CSAT practice, and mock test deadlines.
        </p>
      </div>

      <Button
        onClick={onNewTask}
        icon={FiPlus}
        className={showForm ? "btn-secondary" : "btn-primary"}
      >
        {showForm ? "ABORT / CLOSE FORM" : "+ NEW TASK DIRECTIVE"}
      </Button>
    </div>
  );
}
const TONE_STYLES = {
  gold: "bg-gold-500/15 text-gold-400 border-gold-500/40 shadow-[0_0_8px_rgba(255,145,0,0.15)]",
  teal: "bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-[0_0_8px_rgba(0,240,255,0.15)]",
  rust: "bg-rust-500/20 text-rust-400 border-rust-500/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]",
  green: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
  neutral: "bg-ink-700/80 text-parchment-300 border-ink-600",
};

const PRIORITY_TONE = { High: "rust", Medium: "gold", Low: "teal" };
const DIFFICULTY_TONE = { Hard: "rust", Medium: "gold", Easy: "teal" };
const STATUS_TONE = { completed: "green", overdue: "rust", pending: "neutral" };

export default function Badge({ children, tone = "neutral", dot, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${TONE_STYLES[tone] || TONE_STYLES.neutral} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_4px_currentColor]" style={{ background: dot }} />}
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const p = priority || "Medium";
  return (
    <Badge tone={PRIORITY_TONE[p] || "neutral"}>
      {p === "High" ? "⚡ HIGH" : `${p.toUpperCase()}`}
    </Badge>
  );
}

export function DifficultyBadge({ difficulty }) {
  return <Badge tone={DIFFICULTY_TONE[difficulty] || "neutral"}>{difficulty}</Badge>;
}

export function StatusBadge({ status }) {
  const label =
    status === "overdue"
      ? "⚠ OVERDUE"
      : status === "completed"
      ? "✓ COMPLETED"
      : "PENDING";
  return <Badge tone={STATUS_TONE[status] || "neutral"}>{label}</Badge>;
}

export function SubjectBadge({ subject, color }) {
  return (
    <Badge tone="neutral" dot={color}>
      {subject}
    </Badge>
  );
}

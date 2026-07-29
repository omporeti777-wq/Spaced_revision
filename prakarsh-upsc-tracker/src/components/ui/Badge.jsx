const TONE_STYLES = {
  gold: "bg-gold-500/10 text-gold-400 border-gold-500/20",
  teal: "bg-teal-500/10 text-teal-300 border-teal-500/20",
  rust: "bg-rust-500/10 text-rust-300 border-rust-500/25",
  neutral: "bg-ink-700 text-parchment-300 border-ink-600",
};

const PRIORITY_TONE = { High: "rust", Medium: "gold", Low: "teal" };
const DIFFICULTY_TONE = { Hard: "rust", Medium: "gold", Easy: "teal" };
const STATUS_TONE = { completed: "teal", overdue: "rust", pending: "neutral" };

export default function Badge({ children, tone = "neutral", dot, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full border ${TONE_STYLES[tone]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return <Badge tone={PRIORITY_TONE[priority] || "neutral"}>{priority} priority</Badge>;
}

export function DifficultyBadge({ difficulty }) {
  return <Badge tone={DIFFICULTY_TONE[difficulty] || "neutral"}>{difficulty}</Badge>;
}

export function StatusBadge({ status }) {
  const label = status === "overdue" ? "Overdue" : status === "completed" ? "Completed" : "Pending";
  return <Badge tone={STATUS_TONE[status] || "neutral"}>{label}</Badge>;
}

export function SubjectBadge({ subject, color }) {
  return (
    <Badge tone="neutral" dot={color}>
      {subject}
    </Badge>
  );
}

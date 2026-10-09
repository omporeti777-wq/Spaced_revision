import Card from "../ui/Card";

export default function StatCard({ label, value, icon: Icon, tone = "gold", sub, delay = 0 }) {
  const toneClasses = {
    gold: "text-gold-400 bg-gold-500/15 border-gold-500/40 shadow-[0_0_12px_rgba(255,145,0,0.2)]",
    teal: "text-teal-400 bg-teal-500/15 border-teal-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]",
    rust: "text-rust-400 bg-rust-500/20 border-rust-500/50 shadow-[0_0_12px_rgba(239,68,68,0.25)]",
    neutral: "text-parchment-300 bg-ink-700/80 border-ink-600",
  };

  const accentBorders = {
    gold: "border-l-4 border-l-gold-500",
    teal: "border-l-4 border-l-teal-400",
    rust: "border-l-4 border-l-rust-500",
    neutral: "border-l-4 border-l-ink-500",
  };

  return (
    <Card
      hover
      className={`p-4 sm:p-5 animate-fadeUp hud-bracket ${accentBorders[tone] || accentBorders.neutral}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-display font-bold uppercase tracking-widest text-parchment-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
            {label}
          </p>
          <p className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-parchment-50 mt-1.5 font-mono">
            {value}
          </p>
          {sub && (
            <p className="text-xs font-tactical text-parchment-400 mt-1 truncate">
              {sub}
            </p>
          )}
        </div>
        {Icon && (
          <div
            className={`w-10 h-10 rounded-sm border flex items-center justify-center shrink-0 ${
              toneClasses[tone] || toneClasses.neutral
            }`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </Card>
  );
}

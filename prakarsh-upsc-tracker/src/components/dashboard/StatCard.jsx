import Card from "../ui/Card";

export default function StatCard({ label, value, icon: Icon, tone = "gold", sub, delay = 0 }) {
  const toneClasses = {
    gold: "text-gold-400 bg-gold-500/10",
    teal: "text-teal-300 bg-teal-500/10",
    rust: "text-rust-300 bg-rust-500/10",
    neutral: "text-parchment-300 bg-ink-700",
  };

  return (
    <Card
      hover
      className="p-5 animate-fadeUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-parchment-500 font-medium">{label}</p>
          <p className="text-3xl font-display font-semibold text-parchment-50 mt-2">{value}</p>
          {sub && <p className="text-xs text-parchment-500 mt-1">{sub}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${toneClasses[tone]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </Card>
  );
}

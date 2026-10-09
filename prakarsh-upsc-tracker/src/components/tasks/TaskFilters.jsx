export default function TaskFilters({
  activeFilter = "all",
  onFilterChange,
  activeCategory = "All",
  onCategoryChange,
  categories = [],
}) {
  const statusFilters = [
    { id: "all", label: "ALL" },
    { id: "pending", label: "PENDING" },
    { id: "completed", label: "COMPLETED" },
    { id: "overdue", label: "OVERDUE" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Status filter tabs */}
      <div className="flex items-center gap-1 p-1 bg-ink-900 rounded-sm border border-ink-600 self-start">
        {statusFilters.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange?.(tab.id)}
            className={`px-3 py-1.5 rounded-sm text-xs font-display font-bold uppercase tracking-wider transition ${
              activeFilter === tab.id
                ? "bg-gold-500 text-ink-950 font-black shadow-glow"
                : "text-parchment-400 hover:text-parchment-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category selector */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase text-parchment-400">SECTOR:</span>
          <select
            value={activeCategory}
            onChange={(e) => onCategoryChange?.(e.target.value)}
            className="bg-ink-900 border border-ink-600 rounded-sm px-3 py-1.5 text-xs font-mono text-parchment-100 outline-none focus:border-gold-500 uppercase"
          >
            <option value="All">ALL SECTORS</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
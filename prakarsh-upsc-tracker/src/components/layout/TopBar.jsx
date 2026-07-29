import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiBell } from "react-icons/fi";
import { useData } from "../../context/DataContext";
import { useTaskSelectors } from "../../hooks/useTaskSelectors";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";
import { useDebounce } from "../../hooks/useDebounce";
import { friendlyDayMonth } from "../../utils/dateHelpers";

export default function TopBar({ onMenuClick }) {
  const { tasks } = useData();
  const { today, overdue } = useTaskSelectors();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 200);

  const searchRef = useRef(null);
  const bellRef = useRef(null);
  useOnClickOutside(searchRef, () => setSearchOpen(false));
  useOnClickOutside(bellRef, () => setBellOpen(false));

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return tasks
      .filter(
        (t) =>
          t.lectureName.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [debouncedQuery, tasks]);

  const pendingAlerts = [...overdue, ...today.filter((t) => !t.completed)].slice(0, 6);

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center gap-3 px-4 sm:px-6 bg-ink-900/85 backdrop-blur-md border-b border-ink-600">
      <button className="lg:hidden text-parchment-300 hover:text-parchment-100" onClick={onMenuClick}>
        <FiMenu size={22} />
      </button>

      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-parchment-500" size={16} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="Search lectures, subjects, faculty…"
          className="w-full bg-ink-800 border border-ink-600 rounded-xl pl-10 pr-3.5 py-2.5 text-sm placeholder:text-parchment-500 focus:border-gold-600 focus:ring-1 focus:ring-gold-600/40 outline-none transition-colors"
        />
        {searchOpen && query && (
          <div className="absolute top-full mt-2 w-full bg-ink-800 border border-ink-600 rounded-xl shadow-soft overflow-hidden animate-fadeUp">
            {results.length === 0 ? (
              <p className="text-xs text-parchment-500 px-4 py-4">No matches for "{query}"</p>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                    navigate("/today", { state: { focusTaskId: r.id } });
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-ink-700 transition-colors flex items-center justify-between gap-3"
                >
                  <span className="truncate text-sm text-parchment-100">{r.lectureName}</span>
                  <span className="text-[11px] text-parchment-500 shrink-0">{r.subject}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="ml-auto relative" ref={bellRef}>
        <button
          onClick={() => setBellOpen((o) => !o)}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center text-parchment-300 hover:bg-ink-800 hover:text-parchment-100 transition-colors"
        >
          <FiBell size={18} />
          {pendingAlerts.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rust-500" />
          )}
        </button>
        {bellOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-ink-800 border border-ink-600 rounded-xl shadow-soft overflow-hidden animate-fadeUp">
            <div className="px-4 py-3 border-b border-ink-600">
              <p className="text-sm font-medium text-parchment-100">Pending revisions</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {pendingAlerts.length === 0 ? (
                <p className="text-xs text-parchment-500 px-4 py-4">You're all caught up. Nice work.</p>
              ) : (
                pendingAlerts.map((t) => (
                  <div key={t.id} className="px-4 py-2.5 hover:bg-ink-700 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm text-parchment-100 truncate">{t.lectureName}</p>
                      <p className="text-[11px] text-parchment-500">{t.subject} · {t.label}</p>
                    </div>
                    <span className={`text-[11px] font-mono shrink-0 ${t.status === "overdue" ? "text-rust-400" : "text-parchment-500"}`}>
                      {friendlyDayMonth(t.date)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

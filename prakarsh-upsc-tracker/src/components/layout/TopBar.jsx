import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSearch, FiBell, FiAlertCircle } from "react-icons/fi";
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
  const [currentTime, setCurrentTime] = useState("");
  const debouncedQuery = useDebounce(query, 200);

  const searchRef = useRef(null);
  const bellRef = useRef(null);
  useOnClickOutside(searchRef, () => setSearchOpen(false));
  useOnClickOutside(bellRef, () => setBellOpen(false));

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <header className="sticky top-0 z-20 h-16 flex items-center gap-4 px-4 sm:px-6 bg-ink-950/90 backdrop-blur-md border-b border-ink-600/90">
      <button
        className="lg:hidden text-parchment-300 hover:text-gold-400 p-1.5 transition"
        onClick={onMenuClick}
      >
        <FiMenu size={22} />
      </button>

      {/* Radar Search Input */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-500/80" size={16} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          placeholder="SEARCH DATABASE // REVISIONS, TOPICS, INTEL..."
          className="w-full bg-ink-900/90 border border-ink-600 rounded-sm pl-10 pr-3.5 py-2 text-xs font-mono font-medium tracking-wide text-parchment-100 placeholder:text-ink-400 focus:border-gold-500 focus:ring-1 focus:ring-gold-500/40 outline-none transition-colors"
        />
        {searchOpen && query && (
          <div className="absolute top-full mt-1.5 w-full bg-ink-900 border border-gold-500/60 rounded-sm shadow-soft overflow-hidden animate-fadeUp z-50">
            <div className="px-3 py-1.5 bg-ink-950/80 border-b border-ink-600 flex items-center justify-between text-[10px] font-mono text-gold-400 uppercase">
              <span>SCAN RESULTS // MATCHES</span>
              <span>{results.length} DETECTED</span>
            </div>
            {results.length === 0 ? (
              <p className="text-xs text-parchment-400 px-4 py-4 font-mono">NO RECORDS FOUND FOR "{query.toUpperCase()}"</p>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                    navigate("/today", { state: { focusTaskId: r.id } });
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-ink-800 transition-colors flex items-center justify-between gap-3 border-b border-ink-800 last:border-b-0"
                >
                  <span className="truncate text-xs font-display font-bold text-parchment-100 uppercase">{r.lectureName}</span>
                  <span className="text-[10px] font-mono text-gold-400 px-1.5 py-0.5 rounded bg-ink-800 border border-ink-600 shrink-0">{r.subject}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Military HUD Telemetry Ticker (hidden on small screens) */}
      <div className="hidden md:flex items-center gap-4 text-[11px] font-mono ml-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-ink-900/80 border border-ink-600">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#00E676]" />
          <span className="text-parchment-400 tracking-widest uppercase">ZULU TIME:</span>
          <span className="text-gold-400 font-bold">{currentTime || "00:00:00"}</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-ink-900/80 border border-ink-600">
          <span className="text-parchment-400 uppercase tracking-widest">DEFCON:</span>
          <span className={`font-bold ${overdue.length > 0 ? "text-rust-400" : "text-teal-400"}`}>
            {overdue.length > 0 ? "1 (ALERT)" : "5 (SECURE)"}
          </span>
        </div>
      </div>

      {/* Alert Radar / Notifications */}
      <div className="relative" ref={bellRef}>
        <button
          onClick={() => setBellOpen((o) => !o)}
          className="relative w-9 h-9 rounded-sm border border-ink-600 bg-ink-900 flex items-center justify-center text-parchment-300 hover:border-gold-500 hover:text-gold-400 transition-colors"
        >
          <FiBell size={16} />
          {pendingAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rust-500 shadow-[0_0_6px_#EF4444] animate-ping" />
          )}
          {pendingAlerts.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rust-500" />
          )}
        </button>

        {bellOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-ink-900 border border-gold-500/60 rounded-sm shadow-soft overflow-hidden animate-fadeUp z-50">
            <div className="px-4 py-3 bg-ink-950 border-b border-ink-600 flex items-center justify-between">
              <span className="text-xs font-display font-bold uppercase tracking-widest text-parchment-100 flex items-center gap-2">
                <FiAlertCircle className="text-gold-400" /> MISSION PENDING ALERTS
              </span>
              <span className="text-[10px] font-mono text-rust-400 font-bold">
                {pendingAlerts.length} QUEUED
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-ink-800">
              {pendingAlerts.length === 0 ? (
                <p className="text-xs font-mono text-parchment-400 px-4 py-4 text-center">
                  // ALL REVISION DIRECTIVES COMPLETED. NO PENDING THREATS.
                </p>
              ) : (
                pendingAlerts.map((t) => (
                  <div key={t.id} className="px-4 py-2.5 hover:bg-ink-800/80 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-display font-bold text-parchment-100 truncate uppercase">{t.lectureName}</p>
                      <p className="text-[10px] font-mono text-parchment-400">{t.subject} · {t.label}</p>
                    </div>
                    <span className={`text-[10px] font-mono shrink-0 px-1.5 py-0.5 rounded border ${
                      t.status === "overdue"
                        ? "text-rust-400 border-rust-500/40 bg-rust-500/10"
                        : "text-gold-400 border-gold-500/40 bg-gold-500/10"
                    }`}>
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

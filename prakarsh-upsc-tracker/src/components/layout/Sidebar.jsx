import { NavLink } from "react-router-dom";
import {
  FiHome, FiCheckSquare, FiCalendar, FiPlusCircle,
  FiBookOpen, FiBarChart2, FiSettings, FiX, FiCheckCircle,FiClipboard,
} from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: FiHome, end: true },
  { to: "/today", label: "Today's Tasks", icon: FiCheckSquare },
  { to: "/calendar", label: "Calendar", icon: FiCalendar },
  { to: "/add-lecture", label: "Add Lecture", icon: FiPlusCircle },
  { to: "/subjects", label: "Subjects", icon: FiBookOpen },
  { to: "/habits", label: "Habit Tracker", icon: FiCheckCircle },
  { to: "/personal-tasks", label: "Personal Tasks", icon: FiClipboard },
  { to: "/statistics", label: "Statistics", icon: FiBarChart2 },
  { to: "/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-950/70 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-[248px] bg-ink-800 border-r border-ink-600 flex flex-col z-40
          transition-transform duration-300 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-5 pt-6 pb-5">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="#171D21" />
              <path d="M4 22 C 9 22, 9 10, 13 10 S 17 22, 20 22 S 24 14, 28 14" stroke="#D4A657" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            </svg>
            <div>
              <p className="font-display font-semibold text-parchment-50 leading-tight">Prakarsh</p>
              <p className="text-[10px] text-parchment-500 uppercase tracking-wider">UPSC Revision</p>
            </div>
          </div>
          <button className="lg:hidden text-parchment-500 hover:text-parchment-100" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative
                ${isActive ? "text-ink-950 bg-gold-500 shadow-glow" : "text-parchment-300 hover:bg-ink-700 hover:text-parchment-100"}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-5 border-t border-ink-600">
          <p className="text-[11px] text-parchment-500 leading-relaxed">
            Consistency compounds.<br />Revise a little, forget a lot less.
          </p>
        </div>
      </aside>
    </>
  );
}

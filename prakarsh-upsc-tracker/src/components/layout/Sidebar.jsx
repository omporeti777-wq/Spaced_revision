import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCheckSquare,
  FiCalendar,
  FiPlusCircle,
  FiBookOpen,
  FiBarChart2,
  FiSettings,
  FiX,
  FiCheckCircle,
  FiClipboard,
  FiLogOut,
  FiCrosshair,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../../auth/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "OPS COMMAND", sub: "Overview", icon: FiHome, end: true },
  { to: "/today", label: "TODAY'S MISSION", sub: "Active Directives", icon: FiCheckSquare },
  { to: "/personal-tasks", label: "TACTICAL TASKS", sub: "Personal Targets", icon: FiClipboard },
  { to: "/calendar", label: "DEPLOYMENT CALENDAR", sub: "Timeline", icon: FiCalendar },
  { to: "/diary", label: "FIELD DIARY", sub: "Mental Log & Notes", icon: FiBookOpen },
  { to: "/add-lecture", label: "LOG INTEL", sub: "Add Lecture", icon: FiPlusCircle },
  { to: "/subjects", label: "SECTOR SUBJECTS", sub: "Syllabus Areas", icon: FiBookOpen },
  { to: "/habits", label: "COMBAT DRILLS", sub: "Habit Tracker", icon: FiCheckCircle },
  { to: "/statistics", label: "WAR ROOM STATS", sub: "Retention Analytics", icon: FiBarChart2 },
  { to: "/settings", label: "SYS CONFIG", sub: "Settings", icon: FiSettings },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, signOut } = useAuth();

  const operatorCallsign = user?.email
    ? user.email.split("@")[0].toUpperCase()
    : "OPERATOR";

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-[260px] bg-ink-900 border-r border-ink-600 flex flex-col z-40
          transition-transform duration-200 ease-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Tactical Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-ink-600/80 bg-ink-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-gold-500/15 border border-gold-500/50 flex items-center justify-center text-gold-400 shadow-[0_0_10px_rgba(255,145,0,0.3)]">
              <FiCrosshair size={20} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold text-gold-400 tracking-widest uppercase">
                  PRAKARSH
                </span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-gold-500/20 text-gold-300 font-mono border border-gold-500/30">
                  UPSC
                </span>
              </div>
              <p className="text-[10px] font-mono text-parchment-500 tracking-wider uppercase">
                TACTICAL OPS // V3.0
              </p>
            </div>
          </div>
          <button className="lg:hidden text-parchment-400 hover:text-parchment-100 p-1" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1 pt-1">
            <p className="text-[10px] font-mono font-bold tracking-widest text-parchment-500 uppercase">
              // DIRECTIVES & INTEL
            </p>
          </div>

          {NAV_ITEMS.map(({ to, label, sub, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-sm text-xs font-display font-bold uppercase tracking-wider transition-all duration-150 border ${
                  isActive
                    ? "bg-gold-500 text-ink-950 border-gold-500 shadow-glow font-black"
                    : "text-parchment-300 hover:bg-ink-800 hover:text-parchment-50 border-transparent hover:border-ink-600"
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} />
                <span>{label}</span>
              </div>
              <span className="text-[9px] font-mono opacity-60 lowercase tracking-normal">
                {sub}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Operator Dossier & Status */}
        <div className="p-3 border-t border-ink-600/80 bg-ink-950/60 space-y-2">
          <div className="p-2.5 rounded-sm bg-ink-800/80 border border-ink-600 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-sm bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center shrink-0 text-xs font-mono font-black shadow-[0_0_8px_rgba(255,145,0,0.2)]">
                <FiShield size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-display font-bold text-parchment-100 truncate tracking-wide">
                  {operatorCallsign}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                    ONLINE // READY
                  </span>
                </div>
              </div>
            </div>

            {user && (
              <button
                onClick={() => signOut()}
                title="Sign out / Terminate Session"
                className="p-1.5 text-parchment-400 hover:text-rust-400 hover:bg-ink-700/80 rounded transition shrink-0"
              >
                <FiLogOut size={16} />
              </button>
            )}
          </div>

          <div className="px-1 text-[10px] font-mono text-parchment-500 flex items-center justify-between">
            <span>UPSC PROTOCOL ACTIVE</span>
            <span className="text-gold-400 font-bold">ALPHA-1</span>
          </div>
        </div>
      </aside>
    </>
  );
}

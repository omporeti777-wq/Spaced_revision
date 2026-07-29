import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, side = false, widthClass = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex" style={{ justifyContent: side ? "flex-end" : "center" }}>
      <div
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-[fadeUp_0.2s_ease-out]"
        onClick={onClose}
      />
      <div
        className={`relative z-10 bg-ink-800 border border-ink-600 shadow-soft
          ${side ? "h-full w-full sm:w-[420px] animate-[fadeUp_0.3s_cubic-bezier(0.16,1,0.3,1)]" : `w-full ${widthClass} m-auto rounded-xl2 max-h-[85vh] animate-popIn`}
          flex flex-col overflow-hidden`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-600 shrink-0">
          <h3 className="text-lg font-display font-medium text-parchment-50">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-parchment-500 hover:bg-ink-700 hover:text-parchment-100 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

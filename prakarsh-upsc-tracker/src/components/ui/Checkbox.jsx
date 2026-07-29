import { FiCheck } from "react-icons/fi";

export default function Checkbox({ checked, onChange, size = "md", ...rest }) {
  const dims = size === "sm" ? "w-4.5 h-4.5" : "w-5 h-5";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      {...rest}
      className={`relative shrink-0 ${dims} rounded-md border-2 transition-all duration-200 flex items-center justify-center
        ${checked ? "bg-gold-500 border-gold-500" : "border-ink-500 hover:border-gold-500/60"}`}
    >
      <FiCheck
        className={`text-ink-950 transition-all duration-200 ${
          checked ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
        size={size === "sm" ? 12 : 14}
        strokeWidth={3}
      />
    </button>
  );
}

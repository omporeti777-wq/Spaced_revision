export default function Button({ children, variant = "primary", icon: Icon, className = "", ...rest }) {
  const variantClass =
    variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-ghost";
  return (
    <button className={`${variantClass} ${className}`} {...rest}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

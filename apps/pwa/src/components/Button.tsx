type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

const base =
  "rounded-full px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary:
    "bg-orange-300 text-stone-900 inset-ring inset-ring-orange-300/20 hover:bg-orange-300/70",
  secondary:
    "border border-stone-200 bg-white text-stone-900 shadow-sm hover:bg-stone-100",
  ghost: "text-stone-500 hover:text-stone-700",
};

export default function Button({
  label,
  variant = "primary",
  type = "button",
  disabled = false,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`.trim()}
    >
      {label}
    </button>
  );
}

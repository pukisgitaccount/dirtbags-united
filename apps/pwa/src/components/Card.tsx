import type { ReactNode } from "react";

type CardProps = {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

// Reusable surface matching the styleguide cards (rounded-2xl, stone border,
// subtle shadow). Optional title + description sit above the content.
export default function Card({
  title,
  description,
  children,
  className = "",
}: CardProps) {
  const hasHeader = title != null || description != null;
  return (
    <div
      className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${className}`.trim()}
    >
      {title != null && (
        <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      )}
      {description != null && (
        <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
      )}
      {children != null && (
        <div className={hasHeader ? "mt-4" : ""}>{children}</div>
      )}
    </div>
  );
}

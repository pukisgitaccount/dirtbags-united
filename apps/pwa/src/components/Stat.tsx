import type { ReactNode } from "react";

type StatProps = {
  children: ReactNode;
  className?: string;
};

export default function Stat({ children, className = "" }: StatProps) {
  return (
    <span className={`font-mono tabular-nums ${className}`.trim()}>
      {children}
    </span>
  );
}

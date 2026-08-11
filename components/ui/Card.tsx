import { ReactNode } from "react";

export default function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group overflow-hidden rounded-2xl border border-mhero-fog bg-white text-mhero-black shadow-sm transition-all duration-500 ease-premium hover:border-mhero-steel/40 hover:shadow-md hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

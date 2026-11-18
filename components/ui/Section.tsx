import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  light?: boolean;
  action?: ReactNode;
  compact?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  title,
  description,
  light = true,
  action,
  compact = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${compact ? "py-10 md:py-14" : "py-20 md:py-28"} ${light ? "bg-white text-mhero-black" : "bg-mhero-black text-white"} ${className}`}
    >
      <div className="container-mhero">
        {(title || description) && (
          <div
            className={`flex items-end justify-between gap-6 ${compact ? "mb-6 md:mb-8" : "mb-12 md:mb-16"}`}
          >
            <div className="max-w-2xl text-start">
              {title && (
                <h2
                  className={`text-start font-bold tracking-tight ${
                    compact ? "text-2xl md:text-3xl" : "text-3xl md:text-5xl"
                  }`}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  className={`mt-4 text-base md:text-lg ${
                    light ? "text-mhero-steel" : "text-white/60"
                  }`}
                >
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0 pb-1">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

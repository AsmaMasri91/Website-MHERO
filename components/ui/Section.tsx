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
  /** Background family, used to collapse the gap between same-colour neighbours.
   *  Set it when className overrides the background. */
  tone?: "light" | "dark" | "tint";
  /** Render the eyebrow label above the title (Figma section header). */
  showEyebrow?: boolean;
}

export default function Section({
  children,
  className = "",
  id,
  title,
  description,
  light = true,
  action,
  tone,
  eyebrow,
  showEyebrow = false,
}: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone ?? (light ? "light" : "dark")}
      className={`section-y ${light ? "bg-white text-mhero-black" : "bg-mhero-black text-white"} ${className}`}
    >
      <div className="container-mhero">
        {(title || description) && (
          <div className="mb-12 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 md:mb-16">
            <div className="max-w-2xl text-start">
              {showEyebrow && eyebrow && (
                <p
                  className={`mb-2.5 text-xs font-semibold uppercase leading-[1.4] tracking-[3px] ${
                    light ? "text-mhero-steel" : "text-white"
                  }`}
                >
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2
                  className="text-start text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl"
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

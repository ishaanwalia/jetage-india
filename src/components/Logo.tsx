"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  variant?: "dark" | "light";
}

export function Logo({ size = "md", showText = true, className = "", variant = "dark" }: LogoProps) {
  const dimensions = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-sm", sub: "text-[8px]" },
    md: { container: "w-10 h-10", icon: "w-5 h-5", text: "text-lg", sub: "text-[10px]" },
    lg: { container: "w-14 h-14", icon: "w-7 h-7", text: "text-2xl", sub: "text-xs" },
  };

  const dim = dimensions[size];
  const textColor = variant === "dark" ? "text-jet-text" : "text-white";
  const subColor = variant === "dark" ? "text-jet-text-muted" : "text-white/60";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${dim.container} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-jet-primary to-jet-primary-dim shadow-glow`}>
        <svg className={`${dim.icon} text-jet-bg`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" rx="1" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${dim.text} font-bold ${textColor} leading-tight tracking-tight`}>
            Jetage
          </span>
          <span className={`${dim.sub} ${subColor} tracking-[0.2em] uppercase font-medium`}>
            India
          </span>
        </div>
      )}
    </div>
  );
}
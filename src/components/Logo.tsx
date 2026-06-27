"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dimensions = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-sm", sub: "text-[8px]" },
    md: { container: "w-10 h-10", icon: "w-5 h-5", text: "text-lg", sub: "text-[10px]" },
    lg: { container: "w-16 h-16", icon: "w-8 h-8", text: "text-2xl", sub: "text-xs" },
  };

  const dim = dimensions[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${dim.container} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-jet-primary to-jet-primary-dark shadow-premium`}>
        <svg className={`${dim.icon} text-white`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-jet-accent rounded-full flex items-center justify-center text-[8px] font-bold text-white">J</span>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${dim.text} font-bold text-jet-navy leading-tight tracking-tight`}>
            Jetage
          </span>
          <span className={`${dim.sub} text-jet-gray tracking-widest uppercase font-medium`}>
            Computer Traders
          </span>
        </div>
      )}
    </div>
  );
}
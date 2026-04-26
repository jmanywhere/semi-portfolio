"use client";

import { ChevronDown } from "lucide-react";

export function ScrollChevron() {
  const handleClick = () => {
    const hero = document.getElementById("hero");
    const next =
      hero?.nextElementSibling ??
      document.querySelector("main > *:nth-child(2)");
    next?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll down"
      className="group flex flex-col items-center gap-2 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
    >
      <span className="font-mono text-[10px] uppercase text-foreground/50 transition-colors duration-300 group-hover:text-primary">
        scroll
      </span>

      {/* Stacked double-chevron for more presence */}
      <span className="flex flex-col items-center -gap-2">
        <ChevronDown
          size={24}
          strokeWidth={2}
          className="text-foreground/60 group-hover:text-primary transition-colors duration-300 animate-bounce [animation-delay:0ms]"
        />
        <ChevronDown
          size={24}
          strokeWidth={2}
          className="text-foreground/30 group-hover:text-primary/50 transition-colors duration-300 animate-bounce [animation-delay:150ms] -mt-3"
        />
      </span>
    </button>
  );
}

import { getTranslations } from "next-intl/server";
import { HeroCanvas } from "@/components/hero-canvas";
import { ScrollChevron } from "@/components/scroll-chevron";

export async function Hero() {
  const t = await getTranslations("hero");

  const stats = [
    { value: t("stat_1_value"), label: t("stat_1_label") },
    { value: t("stat_2_value"), label: t("stat_2_label") },
    { value: t("stat_3_value"), label: t("stat_3_label") },
    { value: t("stat_4_value"), label: t("stat_4_label") },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex flex-col justify-center px-6 pt-20 pb-16 overflow-hidden"
    >
      {/* Interactive background */}
      <HeroCanvas />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Eyebrow */}
        <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-6 animate-fade-in">
          semi.engineer
        </p>

        {/* Name + role */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.05] mb-4 animate-fade-in [animation-delay:80ms]">
          {t("name")}
        </h1>

        <p className="text-lg sm:text-xl text-primary font-medium mb-6 animate-fade-in [animation-delay:140ms]">
          {t("role")}
        </p>

        {/* Tagline */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mb-10 animate-fade-in [animation-delay:200ms]">
          {t("tagline")}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-16 animate-fade-in [animation-delay:260ms]">
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("cta_work")}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {t("cta_contact")}
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-fade-in [animation-delay:320ms]">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-mono text-xl font-semibold text-foreground tabular-nums">
                {value}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <ScrollChevron />
      </div>
    </section>
  );
}

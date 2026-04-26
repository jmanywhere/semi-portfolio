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
      className="relative min-h-dvh flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden"
    >
      <HeroCanvas />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_32%,color-mix(in_oklch,var(--accent),transparent_64%),transparent_34%),linear-gradient(110deg,var(--background)_0%,color-mix(in_oklch,var(--background),transparent_10%)_46%,transparent_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-end gap-10 md:grid-cols-[minmax(0,1.05fr)_360px]">
        <div>
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-foreground/15 bg-background/75 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-md animate-fade-in">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_0_5px_color-mix(in_oklch,var(--primary),transparent_80%)]" />
            <span className="font-mono">semi.engineer</span>
            <span className="hidden text-muted-foreground sm:inline">production systems, shipped</span>
          </div>

          <h1 className="font-display max-w-4xl text-5xl font-bold leading-[0.95] text-foreground sm:text-7xl md:text-8xl animate-fade-in [animation-delay:80ms]">
            {t("name")}
          </h1>

          <p className="mt-5 max-w-2xl text-xl font-semibold text-primary sm:text-2xl animate-fade-in [animation-delay:140ms]">
            {t("role")}
          </p>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg animate-fade-in [animation-delay:200ms]">
            {t("tagline")}
          </p>

          <div className="mt-9 flex flex-wrap gap-3 animate-fade-in [animation-delay:260ms]">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-[6px_6px_0_color-mix(in_oklch,var(--primary),transparent_20%)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("cta_work")}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-foreground/20 bg-background/70 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {t("cta_contact")}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-md border border-foreground/15 bg-background/70 p-3 shadow-[10px_10px_0_color-mix(in_oklch,var(--foreground),transparent_92%)] backdrop-blur-md animate-fade-in [animation-delay:320ms]">
          {stats.map(({ value, label }) => (
            <div
              key={label}
              className="min-h-28 min-w-0 overflow-hidden rounded-sm border border-border/80 bg-card/80 p-3 sm:p-4"
            >
              <span className="block max-w-full font-display text-[1.6rem] font-bold leading-none text-foreground tabular-nums sm:text-[1.75rem]">
                {value}
              </span>
              <span className="mt-3 block text-[11px] font-medium uppercase leading-snug text-muted-foreground sm:text-xs">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
        <ScrollChevron />
      </div>
    </section>
  );
}

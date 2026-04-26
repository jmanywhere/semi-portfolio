import { getTranslations } from "next-intl/server";
import {
  Eye,
  MessageSquare,
  Globe,
  Lock,
  Users,
  HeartHandshake,
} from "lucide-react";

const valueIcons = {
  transparency: Eye,
  directness: MessageSquare,
  equality: Globe,
  privacy: Lock,
  teamwork: Users,
  purpose: HeartHandshake,
} as const;

type ValueKey = keyof typeof valueIcons;

export async function Values() {
  const t = await getTranslations("values");
  const keys: ValueKey[] = [
    "transparency",
    "teamwork",
    "purpose",
    "directness",
    "equality",
    "privacy",
  ];

  return (
    <section id="values" className="relative px-6 py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-foreground/[0.035] dark:bg-white/[0.025]" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
          <div>
            <span className="font-mono text-xs uppercase text-primary">
              {t("eyebrow")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-none text-foreground md:text-5xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("intro")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          {keys.map((key, index) => {
            const Icon = valueIcons[key];
            const featured = key === "teamwork" || key === "purpose";

            return (
              <div
                key={key}
                className={
                  featured
                    ? "group relative overflow-hidden rounded-md border border-primary/25 bg-card p-6 shadow-[10px_10px_0_color-mix(in_oklch,var(--accent),transparent_72%)] transition duration-300 hover:-translate-y-1 hover:border-primary/45 md:col-span-3"
                    : "group relative overflow-hidden rounded-md border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/35 md:col-span-2"
                }
              >
                <span className="absolute -right-3 -top-5 font-display text-8xl font-bold leading-none text-foreground/[0.04]">
                  {index + 1}
                </span>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <Icon size={15} aria-hidden />
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(`${key}.label`)}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                  {t(`${key}.body`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

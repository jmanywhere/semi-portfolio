import { getTranslations } from "next-intl/server";
import { Layers, Monitor, Server, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  blockchain: Layers,
  frontend: Monitor,
  backend: Server,
  other: Cpu,
} as const;

type PillarKey = keyof typeof icons;

export async function Pillars() {
  const t = await getTranslations("pillars");

  const pillars: PillarKey[] = ["blockchain", "frontend", "backend", "other"];

  return (
    <section id="skills" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 font-display text-3xl font-bold leading-none text-foreground md:text-5xl">
          {t("title")}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {pillars.map((key, index) => {
            const Icon = icons[key];
            const isPrimary = key === "blockchain";

            return (
              <div
                key={key}
                className={cn(
                  "group relative overflow-hidden rounded-md border border-border bg-background/70 p-6 transition duration-300",
                  "hover:-translate-y-1 hover:border-primary/45 hover:bg-card"
                )}
              >
                <span className="absolute -right-3 -top-5 font-display text-8xl font-bold leading-none text-foreground/[0.035]">
                  {index + 1}
                </span>
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-sm border",
                      isPrimary
                        ? "border-primary/30 bg-primary text-primary-foreground"
                        : "border-border bg-muted text-muted-foreground transition-colors group-hover:text-foreground"
                    )}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="mb-2 text-base font-semibold text-foreground">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(`${key}.summary`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

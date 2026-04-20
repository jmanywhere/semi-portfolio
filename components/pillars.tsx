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
    <section id="skills" className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-12">
          {t("title")}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {pillars.map((key) => {
            const Icon = icons[key];
            const isPrimary = key === "blockchain";

            return (
              <div
                key={key}
                className={cn(
                  "group rounded-xl border border-border p-6 transition-colors duration-200",
                  "hover:border-primary/40 hover:bg-card"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "shrink-0 size-9 rounded-lg flex items-center justify-center",
                      isPrimary
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground group-hover:text-foreground transition-colors"
                    )}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
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

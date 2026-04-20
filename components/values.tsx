import { getTranslations } from "next-intl/server";
import { Eye, MessageSquare, Globe, Lock } from "lucide-react";

const valueIcons = {
  transparency: Eye,
  directness: MessageSquare,
  equality: Globe,
  privacy: Lock,
} as const;

type ValueKey = keyof typeof valueIcons;

export async function Values() {
  const t = await getTranslations("values");
  const keys: ValueKey[] = ["transparency", "directness", "equality", "privacy"];

  return (
    <section id="values" className="py-24 md:py-32 px-6 bg-card/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-12">
          {t("title")}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {keys.map((key) => {
            const Icon = valueIcons[key];
            return (
              <div
                key={key}
                className="rounded-xl border border-border p-6 hover:border-primary/30 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon
                    size={15}
                    className="text-primary shrink-0"
                    aria-hidden
                  />
                  <h3 className="text-sm font-semibold text-foreground">
                    {t(`${key}.label`)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
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

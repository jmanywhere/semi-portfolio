import { getTranslations } from "next-intl/server";
import { projects } from "@/lib/data";

const domainColors: Record<string, string> = {
  blockchain:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  backend:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  frontend:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

export async function Work() {
  const t = await getTranslations("projects");

  return (
    <section id="work" className="py-24 md:py-32 px-6 bg-card/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-12">
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => {
            const title = t(`items.${project.id}.title`);
            const desc = t(`items.${project.id}.desc`);

            return (
              <article
                key={project.id}
                className="flex flex-col rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors duration-200"
              >
                {/* Domain badge */}
                <span
                  className={`self-start text-[11px] font-medium px-2 py-0.5 rounded-full mb-4 ${domainColors[project.domain]}`}
                >
                  {project.domain}
                </span>

                <h3 className="text-sm font-semibold text-foreground mb-3 leading-snug">
                  {title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
                  {desc}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

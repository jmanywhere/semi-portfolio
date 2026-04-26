import { getLocale, getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import { projects } from "@/lib/data";

const domainColors: Record<string, string> = {
  blockchain:
    "bg-primary/12 text-primary border-primary/20",
  backend:
    "bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/20",
  frontend:
    "bg-accent/35 text-accent-foreground border-accent/40",
};

export async function Work() {
  const t = await getTranslations("projects");
  const locale = await getLocale();

  return (
    <section id="work" className="relative px-6 py-24 md:py-32">
      <div className="absolute inset-0 -z-10 bg-foreground/[0.035] dark:bg-white/[0.025]" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-3xl font-bold leading-none text-foreground md:text-5xl">
            {t("title")}
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("intro")}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {projects.map((project, index) => {
            const title = t(`items.${project.id}.title`);
            const desc = t(`items.${project.id}.desc`);
            const metric = t(`items.${project.id}.metric`);

            return (
              <article
                key={project.id}
                className="group relative flex min-h-[360px] flex-col overflow-hidden rounded-md border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[12px_12px_0_color-mix(in_oklch,var(--primary),transparent_65%)]"
              >
                <span className="absolute right-5 top-5 font-display text-6xl font-bold leading-none text-foreground/[0.045]">
                  0{index + 1}
                </span>

                <span
                  className={`mb-12 self-start rounded-full border px-2.5 py-1 text-[11px] font-semibold ${domainColors[project.domain]}`}
                >
                  {project.domain}
                </span>

                <div className="mb-5 border-l-4 border-primary pl-4">
                  <p className="font-display text-3xl font-bold leading-none text-foreground">
                    {metric}
                  </p>
                </div>

                <h3 className="mb-3 text-base font-semibold leading-snug text-foreground">
                  {title}
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>

                {project.links && (
                  <div className="mb-5 flex flex-wrap gap-2">
                    {project.links.map((link) => {
                      const href = link.localizedPath
                        ? `${link.href}/${locale}/${link.localizedPath}`
                        : link.href;

                      return (
                        <a
                          key={link.labelKey}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-background/70 px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {t(`links.${link.labelKey}`)}
                          <ExternalLink size={12} aria-hidden />
                        </a>
                      );
                    })}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground"
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

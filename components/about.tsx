import { getTranslations } from "next-intl/server";
import { MapPin, GraduationCap } from "lucide-react";
import { earlierExperience, engineeringExperience } from "@/lib/data";

export async function About() {
  const t = await getTranslations("about");

  const certs = [
    t("cert_1"),
    t("cert_2"),
  ];

  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 font-display text-3xl font-bold leading-none text-foreground md:text-5xl">
          {t("title")}
        </h2>

        <div className="grid gap-12 md:grid-cols-[1fr_320px] md:gap-16">
          <div className="space-y-5">
            <p className="max-w-3xl text-lg leading-relaxed text-foreground/90">
              {t("bio_p1")}
            </p>
            <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
              {t("bio_p2")}
            </p>

            <div className="border-t border-border pt-8">
              <h3 className="mb-6 text-sm font-semibold uppercase text-foreground">
                {t("eng_title")}
              </h3>

              <ol className="relative ml-1 space-y-6 border-l border-border">
                {engineeringExperience.map(({ id }) => {
                  const role = t(`exp_${id}_role` as Parameters<typeof t>[0]);
                  const org = t(`exp_${id}_org` as Parameters<typeof t>[0]);
                  const period = t(`exp_${id}_period` as Parameters<typeof t>[0]);
                  const desc = t(`exp_${id}_desc` as Parameters<typeof t>[0]);

                  return (
                    <li key={id} className="relative pl-5">
                      <span className="absolute -left-[6px] top-[5px] size-3 rounded-full border-2 border-primary bg-background" />

                      <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-sm font-semibold text-foreground">
                          {role}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {org}
                        </span>
                        {period && (
                          <span className="ml-auto font-mono text-[11px] text-muted-foreground/70">
                            {period}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {desc}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="mb-2 text-sm font-semibold uppercase text-foreground">
                {t("earlier_title")}
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                {t("earlier_intro")}
              </p>

              <ol className="relative ml-1 space-y-6 border-l border-border">
                {earlierExperience.map(({ id }) => {
                  const role = t(`exp_${id}_role` as Parameters<typeof t>[0]);
                  const org = t(`exp_${id}_org` as Parameters<typeof t>[0]);
                  const period = t(`exp_${id}_period` as Parameters<typeof t>[0]);
                  const desc = t(`exp_${id}_desc` as Parameters<typeof t>[0]);

                  return (
                    <li key={id} className="relative pl-5">
                      <span className="absolute -left-[5px] top-[5px] size-2.5 rounded-full border-2 border-border bg-background" />

                      <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="text-sm font-semibold text-foreground">
                          {role}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          / {org}
                        </span>
                        {period && (
                          <span className="ml-auto font-mono text-[11px] text-muted-foreground/70">
                            {period}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {desc}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-md border border-border bg-card p-5 shadow-[8px_8px_0_color-mix(in_oklch,var(--accent),transparent_68%)]">
              <p className="font-display text-3xl font-bold leading-none text-foreground">
                {t("arc_title")}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t("arc_body")}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span>{t("location")}</span>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <GraduationCap size={14} className="shrink-0 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t("certs_title")}
                </h3>
              </div>
              <ul className="space-y-2">
                {certs.map((cert) => (
                  <li
                    key={cert}
                    className="border-l-2 border-primary/30 pl-4 text-sm leading-snug text-muted-foreground"
                  >
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-border bg-muted/60 p-4">
              <p className="font-mono text-xs leading-relaxed text-muted-foreground/80">
                Frontend · Backend · Blockchain
                <br />
                Web3 · Payments · Product Engineering
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

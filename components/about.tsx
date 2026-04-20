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
    <section id="about" className="py-24 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-12">
          {t("title")}
        </h2>

        <div className="grid md:grid-cols-[1fr_280px] gap-12 md:gap-16">
          {/* Left — bio */}
          <div className="space-y-5">
            <p className="text-base text-foreground/90 leading-relaxed">
              {t("bio_p1")}
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t("bio_p2")}
            </p>

            {/* Engineering career */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-6">
                {t("eng_title")}
              </h3>

              <ol className="relative border-l border-border space-y-6 ml-1">
                {engineeringExperience.map(({ id }) => {
                  const role = t(`exp_${id}_role` as Parameters<typeof t>[0]);
                  const org = t(`exp_${id}_org` as Parameters<typeof t>[0]);
                  const period = t(`exp_${id}_period` as Parameters<typeof t>[0]);
                  const desc = t(`exp_${id}_desc` as Parameters<typeof t>[0]);

                  return (
                    <li key={id} className="pl-5 relative">
                      <span className="absolute -left-[5px] top-[5px] size-2.5 rounded-full border-2 border-primary/50 bg-background" />

                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {role}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          — {org}
                        </span>
                        {period && (
                          <span className="font-mono text-[11px] text-muted-foreground/70 ml-auto">
                            {period}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Earlier career */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                {t("earlier_title")}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t("earlier_intro")}
              </p>

              <ol className="relative border-l border-border space-y-6 ml-1">
                {earlierExperience.map(({ id }) => {
                  const role = t(`exp_${id}_role` as Parameters<typeof t>[0]);
                  const org = t(`exp_${id}_org` as Parameters<typeof t>[0]);
                  const period = t(`exp_${id}_period` as Parameters<typeof t>[0]);
                  const desc = t(`exp_${id}_desc` as Parameters<typeof t>[0]);

                  return (
                    <li key={id} className="pl-5 relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[5px] top-[5px] size-2.5 rounded-full border-2 border-border bg-background" />

                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-1">
                        <span className="text-sm font-medium text-foreground">
                          {role}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          — {org}
                        </span>
                        {period && (
                          <span className="font-mono text-[11px] text-muted-foreground/70 ml-auto">
                            {period}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {desc}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Right — meta */}
          <aside className="space-y-6">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="shrink-0 text-primary" />
              <span>{t("location")}</span>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap size={14} className="shrink-0 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t("certs_title")}
                </h3>
              </div>
              <ul className="space-y-2">
                {certs.map((cert) => (
                  <li
                    key={cert}
                    className="text-sm text-muted-foreground leading-snug pl-4 border-l-2 border-primary/30"
                  >
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* LinkedIn title blurb */}
            <div className="rounded-lg bg-muted/50 border border-border p-4">
              <p className="text-xs font-mono text-muted-foreground/80 leading-relaxed">
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

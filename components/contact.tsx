import { getTranslations } from "next-intl/server";
import { Mail, MessageCircle, Coffee, Blocks } from "lucide-react";
import { siteLinks } from "@/lib/data";

function GithubIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

type LinkCard = {
  label: string;
  href: string;
  mono: string;
  icon: React.ReactNode;
};

export async function Contact() {
  const t = await getTranslations("contact");

  const links: LinkCard[] = [
    {
      label: t("email"),
      href: `mailto:${siteLinks.email}`,
      mono: siteLinks.email,
      icon: <Mail size={16} aria-hidden />,
    },
    {
      label: t("github"),
      href: siteLinks.github,
      mono: "github.com/jmanywhere",
      icon: <GithubIcon size={16} />,
    },
    {
      label: t("linkedin"),
      href: siteLinks.linkedin,
      mono: "linkedin.com/in/semiinvader",
      icon: <LinkedinIcon size={16} />,
    },
  ];

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 md:py-32">
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary),transparent_88%),transparent_55%)]" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 grid gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-end">
          <div>
            <span className="font-mono text-xs uppercase text-primary">
              {t("eyebrow")}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold leading-none text-foreground md:text-5xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("body")}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {links.map(({ label, href, icon, mono }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                className="group flex min-w-0 items-center gap-3 rounded-md border border-border bg-card px-5 py-4 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[8px_8px_0_color-mix(in_oklch,var(--primary),transparent_72%)]"
              >
                <span className="shrink-0 text-primary">{icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">
                    {mono}
                  </p>
                </div>
              </a>
            ))}
          </div>

          <aside className="rounded-md border border-primary/25 bg-card p-5 shadow-[8px_8px_0_color-mix(in_oklch,var(--primary),transparent_72%)]">
            <p className="font-display text-2xl font-bold leading-none text-foreground">
              {t("signal_title")}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("signal_body")}
            </p>
            <div className="mt-5 grid gap-2 text-sm text-foreground">
              <div className="flex items-center gap-2">
                <MessageCircle size={15} className="text-primary" aria-hidden />
                <span>{t("signal_1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Blocks size={15} className="text-primary" aria-hidden />
                <span>{t("signal_2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee size={15} className="text-primary" aria-hidden />
                <span>{t("signal_3")}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 font-mono text-xs text-muted-foreground/60 sm:flex-row">
        <span>© {new Date().getFullYear()} Semi Fernandez</span>
        <span>{t("built_with")}</span>
      </div>
    </footer>
  );
}

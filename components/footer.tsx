import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/60 font-mono">
        <span>© {new Date().getFullYear()} Semi Fernandez</span>
        <span>{t("built_with")}</span>
      </div>
    </footer>
  );
}

import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main id="main" className="flex flex-col">
      {/* Phase 2: sections go here */}
      <section className="min-h-dvh flex items-center justify-center px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs text-muted-foreground mb-4 tracking-widest uppercase">
            semi.engineer
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Semi Fernandez
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Senior Engineer — Blockchain · Frontend · Backend
          </p>
          <p className="mt-6 text-sm text-muted-foreground/60 font-mono">
            Phase 1 complete — content coming in Phase 2
          </p>
        </div>
      </section>
    </main>
  );
}

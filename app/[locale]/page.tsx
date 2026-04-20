import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Pillars } from "@/components/pillars";
import { Work } from "@/components/work";
import { About } from "@/components/about";
import { Values } from "@/components/values";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Mascot } from "@/components/mascot";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main id="main" className="flex flex-col">
        <Hero />
        <Pillars />
        <Work />
        <About />
        <Values />
        <Contact />
      </main>
      <Footer />
      <Mascot />
    </>
  );
}

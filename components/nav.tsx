"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname } from "@/i18n/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Nav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const otherLocale = locale === "en" ? "es" : "en";
  const otherLocaleLabel = locale === "en" ? "ES" : "EN";

  const navLinks = [
    { href: "#work", label: t("work") },
    { href: "#about", label: t("about") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <nav
        className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Semi Fernandez — home"
        >
          semi.engineer
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}

          {/* Divider */}
          <span className="w-px h-4 bg-border" aria-hidden />

          {/* Language toggle */}
          <Link
            href={pathname} locale={otherLocale as "en" | "es"}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("switch_lang")}
          >
            {otherLocaleLabel}
          </Link>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded-sm"
            aria-label={t("toggle_theme")}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )
            ) : (
              <span className="size-[15px] block" />
            )}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href={pathname} locale={otherLocale as "en" | "es"}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label={t("switch_lang")}
          >
            {otherLocaleLabel}
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1 rounded-sm"
            aria-label={t("toggle_theme")}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )
            ) : (
              <span className="size-[15px] block" />
            )}
          </button>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 -m-1"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-200",
          menuOpen ? "max-h-48" : "max-h-0"
        )}
      >
        <div className="px-6 pb-4 border-b border-border bg-background/95 backdrop-blur-md flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

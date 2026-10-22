"use client";

import { useMemo, useState } from "react";
<<<<<<< HEAD
import { ArrowRight, Lock, Menu, X } from "lucide-react";

import { LocaleSwitcher } from "@/components/marketing/locale-switcher";
import { Monogram } from "@/components/brand";
=======
import { Lock, Menu, X } from "lucide-react";

import Link from "next/link";
import { LeadButton } from "./experience";
import { LocaleSwitcher } from "@/components/marketing/locale-switcher";
import { MarketingLogo } from "./visual-system";
>>>>>>> f0c90fc (Latest Front End)
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { Dictionary, Locale } from "@/lib/i18n/get-dictionary";

interface NavbarProps {
  dict: Dictionary;
  locale: Locale;
}

export function Navbar({ dict, locale }: NavbarProps) {
  const [open, setOpen] = useState(false);

<<<<<<< HEAD
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const loginUrl = `${appUrl}/login`;

  const NAV_LINKS = useMemo(
    () => [
      { href: "#services", label: dict.nav.services },
      { href: "#packages", label: dict.nav.packages },
      { href: "#process", label: dict.nav.process },
      { href: "#faq", label: dict.nav.faq },
    ],
    [dict]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
=======
  const loginUrl = "/login";

  const NAV_LINKS = useMemo(
    () => [
      { href: "/", label: locale === "ar" ? "الرئيسية" : "Home" },
      { href: "/platform", label: locale === "ar" ? "المنصة" : "Platform" },
      { href: "/services", label: dict.nav.services },
      { href: "/#faq", label: dict.nav.faq },
    ],
    [dict, locale]
  );

  return (
    <header className="relative z-30 border-b border-border bg-background/85 backdrop-blur-xl">
>>>>>>> f0c90fc (Latest Front End)
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
<<<<<<< HEAD
        <a href="#top" className="flex items-center gap-2.5">
          <Monogram />
          <span className="hidden text-lg font-bold tracking-tight text-foreground sm:inline">
            SpeciaLevel
          </span>
        </a>
=======
        <Link href="/" aria-label="SpeciaLevel" className="flex items-center gap-2.5">
          <MarketingLogo />
        </Link>
>>>>>>> f0c90fc (Latest Front End)

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle variant="ghost" labels={dict.platform.theme} />
          <LocaleSwitcher locale={locale} dict={dict.langSwitcher} />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <a href={loginUrl}>
              <Lock />
              {dict.nav.clientPortal}
            </a>
          </Button>
<<<<<<< HEAD
          <Button asChild size="lg">
            <a href="#contact">
              {dict.nav.bookConsultation}
              <ArrowRight className="rtl:rotate-180" />
            </a>
          </Button>
=======
          <LeadButton mode="booking">{dict.nav.bookConsultation}</LeadButton>
>>>>>>> f0c90fc (Latest Front End)
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle variant="ghost" labels={dict.platform.theme} />
          <LocaleSwitcher locale={locale} dict={dict.langSwitcher} />
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2">
<<<<<<< HEAD
              <Button asChild size="lg">
                <a href="#contact" onClick={() => setOpen(false)}>
                  {dict.nav.bookConsultation}
                  <ArrowRight className="rtl:rotate-180" />
                </a>
              </Button>
=======
              <div onClick={() => setOpen(false)}><LeadButton mode="booking">{dict.nav.bookConsultation}</LeadButton></div>
>>>>>>> f0c90fc (Latest Front End)
              <Button asChild variant="outline" size="lg">
                <a href={loginUrl} onClick={() => setOpen(false)}>
                  {dict.nav.clientPortal}
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f0c90fc (Latest Front End)

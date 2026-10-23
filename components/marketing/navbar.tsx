
"use client";

import { useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Lock, Menu, X } from "lucide-react";
import Link from "next/link";

import { LeadButton } from "./experience";
import { LocaleSwitcher } from "@/components/marketing/locale-switcher";
import { MarketingLogo } from "./visual-system";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import type { Dictionary, Locale } from "@/lib/i18n/get-dictionary";

interface NavbarProps {
  dict: Dictionary;
  locale: Locale;
}

export function Navbar({ dict, locale }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
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
    <header className="relative z-30 border-b border-border bg-background/85 backdrop-blur-xl" onKeyDown={event => {
      if (event.key === "Escape" && open) { setOpen(false); menuButton.current?.focus(); }
    }}>
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link
          href="/"
          aria-label="SpeciaLevel"
          className="flex items-center gap-2.5"
        >
          <MarketingLogo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === pathname ? "page" : undefined}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {link.label}
            </Link>
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
            <Link href={loginUrl}>
              <Lock />
              {dict.nav.clientPortal}
            </Link>
          </Button>

          <LeadButton mode="booking">
            {dict.nav.bookConsultation}
          </LeadButton>
        </div>

        <div className="marketing-mobile-trigger flex items-center gap-2 md:hidden">
          <Button
            ref={menuButton}
            variant="ghost"
            size="icon"
            aria-expanded={open}
            aria-controls="marketing-mobile-menu"
            aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open && (
        <div id="marketing-mobile-menu" className="marketing-mobile-menu border-t border-border bg-background/95 px-4 pb-4 pt-2 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={link.href === pathname ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}

            <div className="marketing-mobile-preferences">
              <LocaleSwitcher locale={locale} dict={dict.langSwitcher} />
              <ThemeToggle variant="outline" labels={dict.platform.theme} />
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <div onClick={() => setOpen(false)}>
                <LeadButton mode="booking">
                  {dict.nav.bookConsultation}
                </LeadButton>
              </div>

              <Button asChild variant="outline" size="lg">
                <Link href={loginUrl} onClick={() => setOpen(false)}>
                  {dict.nav.clientPortal}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

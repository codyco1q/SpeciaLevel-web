<<<<<<< HEAD
import { ArrowRight } from "lucide-react";

import { Monogram } from "@/components/brand";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

const SECTION_LINKS = ["services", "packages", "process", "faq"] as const;

export function Footer({ dict }: { dict: Dictionary }) {
  const year = new Date().getFullYear();
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
  const loginUrl = `${appUrl}/login`;

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-3">
            <a href="#top" className="flex items-center gap-2.5">
              <Monogram />
              <span className="text-lg font-bold tracking-tight text-foreground">
                SpeciaLevel
              </span>
            </a>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dict.footer.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            {SECTION_LINKS.map((key) => (
              <a
                key={key}
                href={`#${key}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {dict.nav[key]}
              </a>
            ))}
            <a
              href="#contact"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.footer.bookConsultation}
            </a>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} SpeciaLevel. {dict.footer.rights}
          </p>
          <a
            href={loginUrl}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
          >
            {dict.footer.clientLogin}
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </a>
=======
import Link from "next/link";
import { LeadButton, TrialButton } from "./experience";
import { ArrowRight, Mail, MapPin } from "lucide-react";

import { MarketingLogo } from "./visual-system";
import type { Dictionary, Locale } from "@/lib/i18n/get-dictionary";



export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const year = new Date().getFullYear();
  return (
    <footer className="marketing-footer">
      <div className="marketing-footer-inner">
        <div className="marketing-footer-grid">
          <div className="marketing-footer-brand">
            <Link href="/" className="flex items-center gap-2.5">
              <MarketingLogo />
            </Link>
            <p>{dict.footer.tagline}</p>
            <a href="mailto:hello@specialevel.com"><Mail />hello@specialevel.com</a>
          </div>
          <nav aria-label={locale === "ar" ? "روابط سريعة" : "Quick links"} className="marketing-footer-links"><h3>{locale === "ar" ? "روابط سريعة" : "Quick links"}</h3>
            {[{href: "/", label: locale === "ar" ? "الرئيسية" : "Home"}, {href: "/platform", label: locale === "ar" ? "المنصة" : "Platform"}, {href: "/services", label: dict.nav.services}, {href: "/#faq", label: dict.nav.faq}].map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="marketing-footer-links"><h3>{locale === "ar" ? "نقدر نساعدك في" : "What we do"}</h3><Link href="/services">{locale === "ar" ? "الأتمتة والذكاء الاصطناعي" : "AI & automation"}</Link><Link href="/services">{locale === "ar" ? "الهوية والتسويق" : "Branding & marketing"}</Link><Link href="/services">{locale === "ar" ? "دعم الأعمال" : "Business support"}</Link><Link href="/services">{locale === "ar" ? "المساعدين الافتراضيين" : "Virtual assistants"}</Link></div>
          <div className="marketing-footer-action"><h3>{locale === "ar" ? "ابدأ من هنا" : "Start here"}</h3><p>{locale === "ar" ? "جرّب المنصة 14 يوم أو اتكلم معانا عن احتياجات مشروعك." : "Try the platform for 14 days or tell us what your business needs."}</p><TrialButton locale={locale} /><LeadButton secondary>{locale === "ar" ? "تواصل معانا" : "Contact us"}</LeadButton></div>
        </div>
        <div className="marketing-footer-bottom"><p>© {year} SpeciaLevel. {dict.footer.rights}</p><span><MapPin />{locale === "ar" ? "نعمل مع الشركات في كل مكان" : "Working with businesses everywhere"}</span><Link href="/login">{dict.footer.clientLogin}<ArrowRight className="rtl:rotate-180" /></Link>
>>>>>>> f0c90fc (Latest Front End)
        </div>
      </div>
    </footer>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f0c90fc (Latest Front End)

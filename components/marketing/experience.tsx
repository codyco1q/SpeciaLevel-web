"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Bot, Check, Rocket, Sparkles, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./contact-form";
import type { Dictionary, Locale } from "@/lib/i18n/get-dictionary";

type Mode = "contact" | "booking" | "chat";
const LeadContext = createContext<(mode: Mode, interest?: string) => void>(() => {});

export function LeadButton({ children, mode = "contact", secondary = false, interest }: { children: ReactNode; mode?: Mode; secondary?: boolean; interest?: string }) {
  const open = useContext(LeadContext);
  return <Button size="lg" variant={secondary ? "outline" : "default"} onClick={() => open(mode, interest)}>{children}<ArrowRight className="rtl:rotate-180" /></Button>;
}

export function TrialButton({ locale }: { locale: Locale }) {
  const label = locale === "ar" ? "ابدأ تجربتك المجانية لمدة 14 يوم" : "Start Your 14-Day Free Trial";
  const pathname = usePathname();
  if (pathname === "/platform") {
    return <Button asChild size="lg"><a href="#plans" onClick={event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const plans = document.getElementById("plans");
      if (!plans) return;
      event.preventDefault();
      // Run on every click, even when #plans is already the current URL.
      plans.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }}>{label}<ArrowRight className="rtl:rotate-180" /></a></Button>;
  }
  return <Button asChild size="lg"><Link href="/platform">{label}<ArrowRight className="rtl:rotate-180" /></Link></Button>;
}

type TrialPlan = "level" | "pro" | "ultra";
const trialPlans = [
  { id: "level" as const, name: "SpeciaLevel", icon: Rocket, audience: { en: "For independent operators", ar: "لأصحاب الأعمال المستقلين" }, features: { en: ["Connected workspace", "CRM, calendar and tasks", "Forms and invoicing", "Guided setup"], ar: ["مساحة عمل مترابطة", "العملاء والتقويم والمهام", "النماذج والفواتير", "إعداد بمساعدة الفريق"] } },
  { id: "pro" as const, name: "SpeciaLevel Pro", icon: Sparkles, audience: { en: "For growing teams", ar: "للفرق اللي بتكبر" }, features: { en: ["Everything in SpeciaLevel", "Time and shift management", "Core AI automations", "Team workflows", "Faster support"], ar: ["كل مميزات SpeciaLevel", "إدارة الوقت والشيفتات", "أتمتة وذكاء اصطناعي", "مسارات عمل للفرق", "دعم أسرع"] }, popular: true },
  { id: "ultra" as const, name: "SpeciaLevel Ultra", icon: Zap, audience: { en: "For advanced operations", ar: "للعمليات المتقدمة" }, features: { en: ["Everything in Pro", "Expanded AI agents", "Advanced automation", "Priority workspace setup", "Priority support"], ar: ["كل مميزات Pro", "وكلاء ذكاء اصطناعي موسّعين", "أتمتة متقدمة", "إعداد بأولوية", "دعم بأولوية"] } },
];

function TrialPlans({ locale, selected, onSelect, onContinue }: { locale: Locale; selected: TrialPlan; onSelect: (plan: TrialPlan) => void; onContinue: () => void }) {
  const ar = locale === "ar";
  return <div className="trial-plans">
    <p className="trial-intro">{ar ? "اختار نقطة البداية المناسبة. تقدر تغيّر خطتك أو تناقش التفاصيل مع فريقنا قبل أي دفع." : "Choose the right starting point. You can change plans or review every detail with our team before paying."}</p>
    <div className="trial-card-grid" role="radiogroup" aria-label={ar ? "اختر خطة التجربة" : "Choose your trial plan"}>
      {trialPlans.map((plan, index) => { const Icon = plan.icon; return <button key={plan.id} type="button" role="radio" aria-checked={selected === plan.id} tabIndex={selected === plan.id ? 0 : -1} className="trial-plan-card" onClick={() => onSelect(plan.id)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next += ar ? -1 : 1;
        else if (event.key === "ArrowLeft") next += ar ? 1 : -1;
        else if (event.key === "ArrowDown") next++;
        else if (event.key === "ArrowUp") next--;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = trialPlans.length - 1;
        else return;
        event.preventDefault();
        next = (next + trialPlans.length) % trialPlans.length;
        onSelect(trialPlans[next].id);
        event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
      }}>
        {plan.popular && <span className="trial-popular">{ar ? "الأكثر اختيارًا" : "Most popular"}</span>}
        <span className="trial-card-icon"><Icon /></span><span className="trial-radio" />
        <strong>{plan.name}</strong><small>{ar ? plan.audience.ar : plan.audience.en}</small>
        <span className="trial-feature-list">{(ar ? plan.features.ar : plan.features.en).map(feature => <span key={feature}><Check />{feature}</span>)}</span>
        <span className="trial-select-label">{selected === plan.id ? (ar ? "تم الاختيار" : "Selected") : (ar ? "اختار الخطة" : "Select plan")}</span>
      </button>; })}
    </div>
    <div className="trial-actions"><Button size="lg" className="trial-continue" onClick={onContinue}><Sparkles />{ar ? "ابدأ تجربتك المجانية لمدة 14 يوم" : "Start Your 14-Day Free Trial"}<ArrowRight className="rtl:rotate-180" /></Button>
    <small className="trial-footnote">{ar ? "بدون التزام. هنأكد معاك تفاصيل الخطة قبل أي اشتراك مدفوع." : "No commitment. We’ll confirm the plan details before any paid subscription begins."}</small></div>
  </div>;
}

export function PlatformPlans({ locale, dict }: { locale: Locale; dict: Dictionary["contact"]["form"] }) {
  const [selected, setSelected] = useState<TrialPlan>("pro");
  const [showDetails, setShowDetails] = useState(false);
  const details = useRef<HTMLDivElement>(null);
  const ar = locale === "ar";
  const plan = trialPlans.find(item => item.id === selected)!;
  const revealDetails = useCallback(() => {
    details.current?.focus({ preventScroll: true });
    details.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }, []);
  useEffect(() => { if (showDetails) revealDetails(); }, [showDetails, revealDetails]);
  return <>
    <TrialPlans locale={locale} selected={selected} onSelect={setSelected} onContinue={() => showDetails ? revealDetails() : setShowDetails(true)} />
    {showDetails && <div id="trial-request" ref={details} tabIndex={-1} className="platform-trial-request">
      <div><p className="marketing-eyebrow">{plan.name}</p><h3>{ar ? "خلينا نجهّز بدايتك." : "Let’s get your workspace started."}</h3><p>{ar ? "ابعت بياناتك والفريق هيتواصل معاك لتجهيز تجربتك. هنأكد كل التفاصيل قبل أي اشتراك مدفوع." : "Send your details and our team will follow up to arrange your trial. We’ll confirm the details before any paid subscription."}</p></div>
      <ContactForm key={selected} dict={{ ...dict, submit: ar ? "اطلب تجربتك المجانية" : "Request my free trial" }} initialMessage={`${ar ? "طلب تجربة لمدة 14 يوم" : "14-day trial request"}: ${plan.name}\n`} />
    </div>}
  </>;
}

export function LeadProvider({ children, dict, locale }: { children: ReactNode; dict: Dictionary; locale: Locale }) {
  const [mode, setMode] = useState<Mode | null>(null);
  const [interest, setInterest] = useState("");
  const open = (next: Mode, service = "") => { setInterest(service); setMode(next); };
  const panel = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const close = useCallback(() => {
    if (closing.current) return;
    const element = panel.current;
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) { setMode(null); return; }
    closing.current = true;
    const chat = element.classList.contains("marketing-chat-panel");
    const animation = element.animate([{opacity:1, transform:"translateY(0) scale(1)"}, {opacity:0, transform:chat ? "translateY(100%) scale(.92)" : "translateY(18px) scale(.97)"}], {duration:chat ? 280 : 180, easing:"ease-in", fill:"forwards"});
    element.parentElement?.animate([{opacity:1},{opacity:0}], {duration:chat ? 290 : 190,fill:"forwards"});
    animation.finished.catch(() => {}).then(() => { closing.current = false; setMode(null); });
  }, []);
  const ar = locale === "ar";
  const calendar = process.env.NEXT_PUBLIC_BOOKING_URL;
  useEffect(() => {
    if (!mode) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.leadOpen = "true";
    const backgroundElement = background.current;
    backgroundElement?.setAttribute("inert", "");
    panel.current?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || document.querySelector('[data-slot="select-content"]')) return;
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, textarea, select, iframe, [tabindex="0"]') || []).filter(el => el.getClientRects().length);
      const first = items[0]; const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.removeEventListener("keydown", keydown); document.body.style.overflow = overflow; delete document.body.dataset.leadOpen; backgroundElement?.removeAttribute("inert"); previous?.focus(); };
  }, [mode, close]);
  const title = mode === "booking" ? (ar ? "احجز مكالمتك" : "Book your call") : mode === "chat" ? (ar ? "إزاي نقدر نساعدك؟" : "How can we help?") : (ar ? "خلينا نتكلم عن مشروعك" : "Let’s talk about your business");
  return <LeadContext.Provider value={open}>
    <div ref={background}>{children}<button className="marketing-chat" onClick={() => open("chat")} aria-label={ar ? "تواصل مع الفريق" : "Contact our team"} aria-haspopup="dialog" aria-expanded={mode === "chat"} aria-controls={mode === "chat" ? "lead-panel" : undefined}><span className="help-robot"><Bot size={28} /><i /></span><span className="help-label">{ar ? "محتاج مساعدة؟" : "Need help?"}</span><ArrowRight className="help-arrow" size={18} /></button></div>
    {mode && <div className={`marketing-overlay ${mode === "chat" ? "marketing-chat-overlay" : ""}`} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div id="lead-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="lead-title" tabIndex={-1} className={`marketing-modal marketing-phone-modal ${mode === "chat" ? "marketing-chat-panel" : ""}`}>
        <div className="phone-console-top" aria-hidden="true"><span>SL://SECURE_LINK</span><i /><span className="phone-console-signal"><b /><b /><b /></span></div>
        <div className="marketing-modal-content">
          {mode === "chat" && <div className="chat-panel-identity"><Bot size={28} /><span>SpeciaLevel <small>{ar ? "فريق الدعم" : "Support team"}</small></span></div>}
          <div className="mb-5 flex items-start justify-between gap-4"><h2 id="lead-title" className="text-2xl font-bold">{title}</h2><Button variant="ghost" size="icon" onClick={close} aria-label={ar ? "إغلاق" : "Close"}><X /></Button></div>
          {mode === "booking" && calendar ? <><iframe title={title} src={calendar} className="h-[60dvh] w-full rounded-xl border" /><a href={calendar} target="_blank" rel="noopener noreferrer" className="mt-4 block underline">{ar ? "افتح التقويم في نافذة جديدة" : "Open calendar in a new window"}</a></> : <>
            <p className="mb-6 text-muted-foreground">{mode === "booking" ? (ar ? "ابعتلنا بياناتك والوقت المناسب ليك، والفريق هيتواصل لتأكيد المكالمة." : "Send your details and preferred time. Our team will follow up to arrange your call.") : (ar ? "سيب رسالتك والفريق هيرد عليك. تقدر تسأل قبل ما تدفع أي حاجة." : "Leave a message and our team will follow up. Ask us anything before you pay.")}</p>
            <ContactForm key={mode + interest} dict={dict.contact.form} initialMessage={interest ? `${ar ? "الخدمة المطلوبة" : "Service of interest"}: ${interest}\n` : ""} />
          </>}
        </div>
        <div className="phone-console-bottom" aria-hidden="true"><span /></div>
      </div>
    </div>}
  </LeadContext.Provider>;
}

/** Desktop gesture paging; overflow sections and touch retain native accessible scrolling. */
export function SectionScroll({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sections = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-scene]") || []);
    const footer = document.querySelector<HTMLElement>("footer");
    const stops = footer ? [...sections, footer] : sections;
    const media = matchMedia("(prefers-reduced-motion: no-preference)");
    const mobile = matchMedia("(max-width: 800px)");
    const nativeMobileScroll = () => mobile.matches;
    const top = (el: HTMLElement) => el === sections[0] ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY);
    let lockedUntil = 0; let lastWheel = 0;
    const move = (direction: number) => {
      const position = window.scrollY;
      const next = direction > 0 ? stops.find(el => top(el) > position + 3) : [...stops].reverse().find(el => top(el) < position - 3);
      if (!next) return;
      lockedUntil = performance.now() + 950;
      window.scrollTo({ top: top(next), behavior: "smooth" });
    };
    const wheel = (e: WheelEvent) => {
      if (nativeMobileScroll() || !media.matches || document.body.dataset.leadOpen || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || !e.deltaY) return;
      const current = [...stops].reverse().find(el => top(el) <= window.scrollY + 4);
      if (current && current.offsetHeight > innerHeight + 4 && window.scrollY < top(current) + current.offsetHeight - innerHeight - 4 && e.deltaY > 0) return;
      if (current && current.offsetHeight > innerHeight + 4 && window.scrollY > top(current) + 4 && e.deltaY < 0) return;
      e.preventDefault();
      const now = performance.now(); const gap = now - lastWheel; lastWheel = now;
      if (now < lockedUntil || gap < 180) return;
      move(Math.sign(e.deltaY));
    };
    const keyboard = (e: KeyboardEvent) => {
      if (nativeMobileScroll() || !media.matches || document.body.dataset.leadOpen || (e.target as HTMLElement).closest("button,a,input,textarea,select,summary,[contenteditable]")) return;
      const current = stops.find(el => top(el) <= scrollY + 4 && top(el) + el.offsetHeight > scrollY + 4);
      if (current && current.offsetHeight > innerHeight + 4) return;
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) return;
      e.preventDefault(); if (performance.now() < lockedUntil) return;
      if (e.key === "Home" || e.key === "End") { window.scrollTo({top: top(stops[e.key === "Home" ? 0 : stops.length - 1]), behavior:"smooth"}); return; }
      move(["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey) ? -1 : 1);
    };
    let touchStart = 0; let touchX = 0; let pageTouch = false;
    const touchstart = (e: TouchEvent) => {
      const current = stops.find(el => top(el) <= scrollY + 4 && top(el) + el.offsetHeight > scrollY + 4);
      pageTouch = !nativeMobileScroll() && media.matches && !document.body.dataset.leadOpen && e.touches.length === 1 && !!current && current.offsetHeight <= innerHeight + 4 && !(e.target as HTMLElement).closest("button,a,input,textarea,select,summary");
      touchStart = e.touches[0]?.clientY ?? 0; touchX = e.touches[0]?.clientX ?? 0;
    };
    const touchmove = (e: TouchEvent) => { if (pageTouch && e.touches.length === 1 && Math.abs(e.touches[0].clientY - touchStart) > Math.abs(e.touches[0].clientX - touchX)) e.preventDefault(); };
    const touchend = (e: TouchEvent) => { const delta = touchStart - (e.changedTouches[0]?.clientY ?? touchStart); if (pageTouch && Math.abs(delta) > 25 && performance.now() >= lockedUntil) move(Math.sign(delta)); pageTouch = false; };
    window.addEventListener("touchstart", touchstart, {passive:true}); window.addEventListener("touchmove", touchmove, {passive:false}); window.addEventListener("touchend", touchend);
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) root.current?.style.setProperty("--scene", String(sections.indexOf(entry.target as HTMLElement))); }); }, { threshold: 0.45 });
    sections.forEach(section => observer.observe(section));
    document.documentElement.classList.add("marketing-snap");
    window.addEventListener("wheel", wheel, { passive: false }); window.addEventListener("keydown", keyboard);
    return () => { window.removeEventListener("touchstart", touchstart); window.removeEventListener("touchmove", touchmove); window.removeEventListener("touchend", touchend); observer.disconnect(); document.documentElement.classList.remove("marketing-snap"); window.removeEventListener("wheel", wheel); window.removeEventListener("keydown", keyboard); };
  }, [pathname]);
  return <div ref={root} className={`marketing-home ${className}`}>
    <div aria-hidden="true" className="marketing-ambient">
      <span className="ambient-circuit ambient-circuit-a" />
      <span className="ambient-circuit ambient-circuit-b" />
      <span className="ambient-scan" />
      <span className="ambient-pulse ambient-pulse-a" />
      <span className="ambient-pulse ambient-pulse-b" />
    </div>
    {children}
  </div>;
}

"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Building2, Palette, Megaphone, Headphones, Code2, Workflow, Check, ArrowUpRight } from "lucide-react";
import { LeadButton } from "./experience";
import { MarketingLogo } from "./visual-system";
import type { Locale } from "@/lib/i18n/get-dictionary";

const offerings = [
  { icon: Building2, en: "Platform setup", ar: "إعداد المنصة", description: "Build a workspace around the way your team actually works. Start with an organized account, clear responsibilities and connected tools.", descriptionAr: "جهّز مساحة عمل تناسب طريقة شغل فريقك، بحساب منظم ومسؤوليات واضحة وأدوات مترابطة.", items: ["Account and organization structure", "Team roles and working processes", "Initial configuration and handover"], itemsAr: ["إعداد الحساب وهيكل المؤسسة", "أدوار الفريق وخطوات العمل", "التجهيز الأولي وتسليم الإعدادات"], fit: "Teams starting on SpeciaLevel or bringing their operations into one place.", fitAr: "الفرق اللي بتبدأ على المنصة أو بتجمع عملياتها في مكان واحد." },
  { icon: Palette, en: "Branding", ar: "الهوية التجارية", description: "Give your business a recognizable identity across the places customers meet you. Define the look, voice and practical assets your team needs.", descriptionAr: "ابنِ هوية مميزة في كل مكان العميل بيتعامل معاك فيه، من الشكل وأسلوب الكلام للمواد اللي فريقك محتاجها.", items: ["Brand direction and visual identity", "Consistent colors, typography and messaging", "Brand assets and usage guidance"], itemsAr: ["اتجاه العلامة والهوية البصرية", "ألوان وخطوط ورسائل متناسقة", "ملفات الهوية وإرشادات استخدامها"], fit: "New businesses and brands ready for a clearer, more consistent presence.", fitAr: "المشاريع الجديدة والعلامات اللي محتاجة حضور أوضح وأكثر تناسقًا." },
  { icon: Megaphone, en: "Marketing", ar: "التسويق", description: "Turn your business goals into a focused marketing brief. Plan the message, prepare the assets and agree how progress will be reviewed.", descriptionAr: "حوّل أهداف مشروعك لخطة تسويق واضحة. نحدد الرسالة ونجهّز المحتوى ونتفق على طريقة متابعة التقدم.", items: ["Audience and campaign planning", "Content and campaign asset preparation", "Review checkpoints and next steps"], itemsAr: ["تحديد الجمهور وتخطيط الحملات", "تجهيز المحتوى ومواد الحملة", "مراجعة التقدم وتحديد الخطوات الجاية"], fit: "Businesses that need help planning and delivering their marketing work.", fitAr: "المشاريع اللي محتاجة مساعدة في تخطيط وتنفيذ التسويق." },
  { icon: Code2, en: "Websites & funnels", ar: "المواقع وصفحات الهبوط", description: "Create a clear path from a visitor’s first impression to their next action. Discuss a website, landing page or funnel designed around your offer.", descriptionAr: "خلّي رحلة الزائر واضحة من أول انطباع لخطوة التواصل أو التسجيل، بموقع أو صفحة هبوط أو Funnel مناسب لعرضك.", items: ["Page structure and user journey", "Responsive design and development", "Forms, calls to action and handover"], itemsAr: ["هيكل الصفحات ورحلة المستخدم", "تصميم وتطوير مناسب لكل الشاشات", "نماذج وأزرار تواصل وتسليم المشروع"], fit: "Businesses launching an offer or improving their online customer journey.", fitAr: "المشاريع اللي بتطلق عرض جديد أو بتطور تجربة العملاء على الإنترنت." },
  { icon: Headphones, en: "Virtual assistants", ar: "المساعدون الافتراضيون", description: "Make room for the work that needs your attention. Define the support role, daily responsibilities and communication process before getting started.", descriptionAr: "وفّر وقتك للشغل اللي محتاج تركيزك. نحدد دور المساعد ومسؤولياته اليومية وطريقة التواصل قبل البداية.", items: ["Calling and follow-up support", "Community moderation and daily tasks", "Role scoping and onboarding support"], itemsAr: ["دعم المكالمات والمتابعة", "الموديريشن والمهام اليومية", "تحديد الدور والمساعدة في التجهيز"], fit: "Owners and teams looking for help with recurring operational tasks.", fitAr: "أصحاب المشاريع والفرق اللي محتاجة دعم في المهام اليومية المتكررة." },
  { icon: Workflow, en: "Automation & support", ar: "الأتمتة ودعم الأعمال", description: "Map repetitive work and identify where connected systems can help. Start with a defined workflow and expand as your needs become clearer.", descriptionAr: "راجع الشغل المتكرر وحدد فين ربط الأنظمة يقدر يساعدك. ابدأ بخطوات عمل واضحة ووسّع النطاق حسب احتياجاتك.", items: ["Workflow mapping and priorities", "Automation and integration scoping", "Operating guidance and support needs"], itemsAr: ["رسم خطوات العمل وتحديد الأولويات", "تحديد نطاق الأتمتة وربط الأنظمة", "إرشادات التشغيل واحتياجات الدعم"], fit: "Businesses reducing manual handoffs and organizing repeatable processes.", fitAr: "المشاريع اللي بتقلّل نقل الشغل يدويًا وبتنظّم العمليات المتكررة." },
] as const;

export function ServiceExplorer({ locale, initialService = 0 }: { locale: Locale; initialService?: number }) {
  const [active, setActive] = useState(
    Number.isInteger(initialService) && initialService >= 0 && initialService < offerings.length ? initialService : 0
  );
  useEffect(() => {
    const select = (event: Event) => { const index = (event as CustomEvent<number>).detail; if (Number.isInteger(index) && index >= 0 && index < offerings.length) setActive(index); };
    window.addEventListener("marketing:service", select); return () => window.removeEventListener("marketing:service", select);
  }, []);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();
  const ar = locale === "ar";
  const service = offerings[active];
  const Icon = service.icon;
  return <div className="service-explorer">
    <div role="tablist" aria-label={ar ? "اختر الخدمة" : "Choose a service"} className="service-tabs">
      {offerings.map((item, index) => <button key={item.en} ref={el => { tabs.current[index] = el; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel`} aria-selected={active === index} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
        let next = index;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = offerings.length - 1;
        else if (event.key === "ArrowRight") next = (index + (ar ? -1 : 1) + offerings.length) % offerings.length;
        else if (event.key === "ArrowLeft") next = (index + (ar ? 1 : -1) + offerings.length) % offerings.length;
        else return;
        event.preventDefault(); setActive(next); tabs.current[next]?.focus();
      }}><item.icon size={17} />{ar ? item.ar : item.en}</button>)}
    </div>
    <div role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0} className="service-detail">
      <div className="service-detail-copy" key={active}>
        <span className="service-number">0{active + 1} / 06</span><Icon className="service-detail-icon" />
        <h3>{ar ? service.ar : service.en}</h3><p>{ar ? service.descriptionAr : service.description}</p>
        <div className="service-fit"><ArrowUpRight size={18} /><p><strong>{ar ? "مناسب لـ" : "A good fit for"}</strong>{ar ? service.fitAr : service.fit}</p></div>
      </div>
      <div className="service-deliverables">
        <h4>{ar ? "نقدر نساعدك في" : "What we can help with"}</h4>
        <ul>{(ar ? service.itemsAr : service.items).map(item => <li key={item}><Check size={17} />{item}</li>)}</ul>
        <p className="marketing-note">{ar ? "النطاق النهائي والتوقيت والتكلفة بيتحددوا حسب احتياجات مشروعك." : "Final scope, timing and pricing are agreed around your project."}</p>
        <LeadButton interest={ar ? service.ar : service.en}>{ar ? "ناقش الخدمة دي" : "Discuss This Service"}</LeadButton>
      </div>
    </div>
  </div>;
}

export function ServicesPreview({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return <div className="services-preview service-node-map" aria-label={ar ? "خدمات SpeciaLevel المتصلة" : "Connected SpeciaLevel services"}>
    <svg className="node-map-lines" viewBox="0 0 900 420" preserveAspectRatio="none" aria-hidden="true"><g><path d="M450 210H350V80H275"/><path d="M450 210H275"/><path d="M450 210H350V340H275"/><path d="M450 210H550V80H625"/><path d="M450 210H625"/><path d="M450 210H550V340H625"/></g><g className="node-map-signals"><circle r="3"><animateMotion dur="4s" repeatCount="indefinite" path="M450 210H350V80H275"/></circle><circle r="3"><animateMotion dur="4.8s" repeatCount="indefinite" path="M450 210H625"/></circle><circle r="3"><animateMotion dur="5.2s" repeatCount="indefinite" path="M450 210H350V340H275"/></circle></g></svg>
    <div className="node-map-hub"><MarketingLogo /></div>
    <div className="node-map-services">{offerings.map((item,index)=><a className={`node-map-service node-map-service-${index}`} key={item.en} href="#service-explorer" onClick={() => window.dispatchEvent(new CustomEvent("marketing:service", { detail:index }))}><span><item.icon/></span><strong>{ar ? item.ar : item.en}</strong><small>0{index+1}</small></a>)}</div>
    <div className="node-map-meta"><span>SL / SERVICE SYSTEM</span><span>06 ACTIVE NODES</span></div>
  </div>;
}


import { ArrowRight, Bot, CalendarDays, Check, Circle, LayoutDashboard, ListChecks, Users, Workflow } from "lucide-react";
import type { Locale } from "@/lib/i18n/get-dictionary";
import { TrialButton } from "./experience";

export function PlatformHero({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const modules = [
    [Users, ar ? "العملاء والفريق" : "People & CRM"],
    [ListChecks, ar ? "المهام والمشاريع" : "Tasks & projects"],
    [Workflow, ar ? "الأتمتة والذكاء الاصطناعي" : "AI & automation"],
  ] as const;
  return <section id="top" data-scene className="marketing-scene platform-product-hero">
    <div className="marketing-inner platform-product-layout">
      <div className="platform-product-copy">
        <p className="marketing-eyebrow">SPECIALEVEL / {ar ? "المنصة" : "THE PLATFORM"}</p>
        <h1>{ar ? <>فريقك. أدواتك.<br /><em>مساحة عمل واحدة.</em></> : <>Your team.<br />Your tools.<br /><em>One workspace.</em></>}</h1>
        <p className="marketing-description">{ar ? "من أول عميل لآخر مهمة، اجمع فريقك ومواعيدك وفواتيرك والأتمتة في نظام واحد. مساحة أوضح لشغل يومك، ومساحة أكبر للي جاي." : "From your first customer to your last task of the day. Bring your people, schedules, invoices and automations into one connected system. Clearer days. More room to grow."}</p>
        <div className="marketing-actions"><TrialButton locale={locale} /><a className="platform-feature-link" href="#features">{ar ? "اكتشف الأدوات" : "See what’s inside"}<ArrowRight className="rtl:rotate-180" size={16} /></a></div>
        <div className="platform-product-promises"><span><Check size={14} />{ar ? "تجربة 14 يوم" : "14-day trial"}</span><span><Check size={14} />{ar ? "إعداد بمساعدة الفريق" : "Guided setup"}</span></div>
      </div>
      <div className="workspace-preview" aria-label={ar ? "تصور توضيحي لمساحة عمل SpeciaLevel" : "Illustrative SpeciaLevel workspace preview"}>
        <div className="workspace-preview-bar"><span className="workspace-window-dots"><i /><i /><i /></span><span>SpeciaLevel / {ar ? "مساحة العمل" : "Workspace"}</span><span className="workspace-preview-label">{ar ? "تصوّر المنصة" : "PRODUCT PREVIEW"}</span></div>
        <div className="workspace-preview-body">
          <div className="workspace-preview-rail" aria-hidden="true"><span className="workspace-rail-brand">S</span>{[LayoutDashboard, Users, CalendarDays, ListChecks, Bot].map((Icon, i) => <span key={i} className={i === 0 ? "is-active" : ""}><Icon size={18} /></span>)}</div>
          <div className="workspace-preview-content">
            <div className="workspace-preview-heading"><div><small>{ar ? "نظرة عامة" : "YOUR WORKSPACE, CONNECTED"}</small><h2>{ar ? "يومك، بصورة أوضح." : "A clearer view of your day."}</h2></div><span className="workspace-avatar">SL</span></div>
            <div className="workspace-module-row">{modules.map(([Icon, title]) => <div key={title}><Icon size={18} /><span>{title}</span><i /></div>)}</div>
            <div className="workspace-task-board"><div className="workspace-board-title"><ListChecks size={16} /><strong>{ar ? "الشغل بيتحرك" : "Keep work moving"}</strong><span>•••</span></div>
              {[ar ? "تابع العملاء الجدد" : "Follow up with new leads", ar ? "راجع مهام الفريق" : "Review the team’s tasks", ar ? "جهّز فاتورة المشروع" : "Prepare the project invoice"].map((task, i) => <div className={`workspace-task workspace-task-${i}`} key={task}><span className="workspace-task-check">{i === 0 ? <Check size={12} /> : <Circle size={12} />}</span><span>{task}</span><small>{i === 0 ? (ar ? "تمت" : "Done") : i === 1 ? (ar ? "قيد التنفيذ" : "In progress") : (ar ? "التالي" : "Up next")}</small></div>)}
            </div>
            <div className="workspace-flow"><div><Workflow size={15} /><strong>{ar ? "خطوات مترابطة. متابعة أسهل." : "Connected steps. Fewer handoffs."}</strong></div><ol>{[ar ? "عميل جديد" : "New lead", ar ? "مهمة للفريق" : "Team task", ar ? "متابعة ذكية" : "AI follow-up"].map((step, i) => <li key={step}><span>0{i + 1}</span>{step}</li>)}</ol></div>
          </div>
        </div>
        <div className="workspace-preview-bottom"><span><i />{ar ? "الناس والشغل والأدوات. مع بعض." : "People, work and tools. Together."}</span><Bot size={15} /></div>
        <div className="workspace-orbit-badge" aria-hidden="true"><Bot size={20} /><span>{ar ? "خطوات أقل. تركيز أكتر." : "Less busywork. More focus."}</span></div>
      </div>
    </div>
  </section>;
}

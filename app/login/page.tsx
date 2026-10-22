import Link from "next/link";
import { ArrowLeft, ArrowRight, Fingerprint, ShieldCheck, Sparkles } from "lucide-react";
import { getLocale } from "@/lib/i18n/get-dictionary";
import "./login.css";

export const metadata = { title: "Client Portal | SpeciaLevel", description: "Secure access to your SpeciaLevel workspace." };

export default async function LoginPage() {
  const locale = await getLocale();
  const ar = locale === "ar";
  const portalUrl = process.env.NEXT_PUBLIC_PORTAL_LOGIN_URL;
  const hasPortal = Boolean(portalUrl && /^https?:\/\//.test(portalUrl));
  return <main className="portal-login-shell" dir={ar ? "rtl" : "ltr"}>
    <div className="portal-atmosphere" aria-hidden="true"><i/><i/><i/><span>01</span><span>10</span><span>SL</span></div>
    <Link href="/" className="portal-back"><ArrowLeft className="rtl:rotate-180" />{ar ? "الرجوع للموقع" : "Back to website"}</Link>
    <section className="portal-login-frame">
      <aside className="portal-login-story">
        <div className="portal-brand" role="img" aria-label="SpeciaLevel" />
        <div className="portal-story-copy"><span className="portal-kicker"><Sparkles />{ar ? "مساحة عملك المتصلة" : "Your connected workspace"}</span><h1>{ar ? "كل عملياتك. مكان واحد آمن." : "Your entire operation. One secure command center."}</h1><p>{ar ? "ادخل لإدارة فريقك، العملاء، المهام والأتمتة من واجهة واحدة." : "Sign in to manage your team, clients, tasks and automations from one focused workspace."}</p></div>
        <div className="portal-system-status"><span><i />{ar ? "بوابة العملاء" : "Client portal"}</span><small>SpeciaLevel workspace</small></div>
      </aside>
      <div className="portal-login-panel">
        <div className="portal-security-mark"><Fingerprint /></div>
        <p className="portal-overline">{ar ? "بوابة العملاء" : "Client portal"}</p>
        <h2>{ar ? "أهلًا بعودتك" : "Welcome back"}</h2>
        <p className="portal-login-subtitle">{hasPortal ? (ar ? "تابع لبوابة العملاء للدخول إلى مساحة العمل." : "Continue to the client portal to sign in to your workspace.") : (ar ? "تسجيل الدخول غير متاح حاليًا. تواصل مع الفريق للحصول على رابط مساحة العمل." : "Sign-in is currently unavailable. Contact our team for your workspace access link.")}</p>
        <div className="portal-login-form">
          <a className="portal-access-link" href={hasPortal ? portalUrl : "mailto:hello@specialevel.com?subject=Portal%20access%20help"}>
            {hasPortal ? (ar ? "افتح بوابة العملاء" : "Open client portal") : (ar ? "اطلب رابط الدخول" : "Request access link")}<ArrowRight className="rtl:rotate-180" />
          </a>
        </div>
        <div className="portal-trust"><ShieldCheck /><span>{ar ? "استخدم رابط مساحة العمل اللي استلمته من فريق SpeciaLevel." : "Use the workspace link provided by the SpeciaLevel team."}</span></div>
      </div>
    </section>
  </main>;
}

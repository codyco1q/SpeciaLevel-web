import { PlatformHero } from "./platform-hero";
import { ServiceExplorer, ServicesPreview } from "./service-explorer";
import { PlatformVisual } from "./visual-system";
import Link from "next/link";
import { projects, testimonials } from "@/lib/marketing-proof";
import type { ReactNode } from "react";
import { Bot, CalendarDays, Clock3, Workflow, Users, ListChecks, FileText, Receipt, ShieldCheck, ArrowRight, Headphones, Palette, Megaphone, Building2 } from "lucide-react";
import type { Dictionary, Locale } from "@/lib/i18n/get-dictionary";
import { Button } from "@/components/ui/button";
import { SectionScroll, LeadButton, TrialButton, PlatformPlans } from "./experience";

const features = [
  [Clock3, "Shifts & time tracking", "الشيفتات وتتبع الوقت", "Manage attendance, working hours and time calculations.", "نظّم الحضور وساعات العمل وحساب الوقت."],
  [Users, "CRM", "إدارة علاقات العملاء", "Keep customer information and follow-ups together.", "كل بيانات العملاء والمتابعات في مكان واحد."],
  [CalendarDays, "Calendars", "التقويمات", "Bring appointments and team schedules into view.", "تابع المواعيد وجداول الفريق بسهولة."],
  [ListChecks, "Task management", "إدارة المهام", "Organize responsibilities and keep work moving.", "وزّع المسؤوليات وتابع تقدم الشغل."],
  [FileText, "Form builder", "إنشاء النماذج", "Collect the information your business needs.", "اجمع المعلومات اللي محتاجها شغلك."],
  [Receipt, "Invoicing", "الفواتير", "Keep billing connected to your operations.", "خلّي الفواتير جزء من دورة شغلك."],
  [Bot, "AI agents", "وكلاء الذكاء الاصطناعي", "Add intelligent assistance to everyday workflows.", "ضيف مساعدة ذكية لخطوات الشغل اليومية."],
  [Workflow, "Automation", "الأتمتة", "Connect steps and reduce repetitive manual tasks.", "اربط الخطوات وقلّل المهام اليدوية المتكررة."],
] as const;
const services = [
  [Building2, "Platform setup", "إعداد المنصة", "Set up your organization and shape your workspace around your business.", "جهّز مؤسستك ونظّم مساحة العمل حسب احتياجات مشروعك."],
  [Palette, "Branding", "بناء الهوية", "Give your business a clear, consistent identity.", "ابنِ هوية واضحة ومتناسقة لمشروعك."],
  [Megaphone, "Marketing", "التسويق", "Support your brand with focused marketing execution.", "ادعم علامتك التجارية بتنفيذ تسويقي مناسب."],
  [Headphones, "Virtual assistants", "المساعدون الافتراضيون", "Find support for calling, moderation and daily business needs.", "مساعدة في المكالمات والموديريشن واحتياجات الشغل اليومية."],
] as const;

export function Scene({ id, eyebrow, title, description, children, hero = false, visual }: { id: string; eyebrow: string; title: string; description?: string; children?: ReactNode; hero?: boolean; visual?: ReactNode }) {
  const Heading = hero ? "h1" : "h2";
  return <section id={id} data-scene className="marketing-scene"><div className={`marketing-inner ${visual ? "marketing-hero-layout" : ""}`}><div className="marketing-copy">
    <p className="marketing-eyebrow">{eyebrow}</p>
    <Heading className={hero ? "marketing-headline" : "marketing-heading"}>{title}</Heading>
    {description && <p className="marketing-description">{description}</p>}
    {children}
  </div>{visual}</div></section>;
}
function LinkButton({ href, children }: { href: string; children: ReactNode }) { return <Button asChild size="lg" variant="outline"><Link href={href}>{children}<ArrowRight className="rtl:rotate-180" /></Link></Button>; }
function Actions({ locale, servicesLink = false }: { locale: Locale; servicesLink?: boolean }) { return <div className="marketing-actions"><TrialButton locale={locale} /><LinkButton href={servicesLink ? "/services" : "/platform"}>{locale === "ar" ? servicesLink ? "استكشف خدماتنا" : "استكشف المنصة" : servicesLink ? "Explore Our Services" : "Explore the Platform"}</LinkButton></div>; }
function FeatureGrid({ locale, compact = false }: { locale: Locale; compact?: boolean }) { return <div className={`marketing-grid ${compact ? "marketing-grid-compact" : ""}`}>{features.map(([Icon, en, ar, desc, arDesc]) => <article className="marketing-card" key={en}><Icon aria-hidden="true" /><h3>{locale === "ar" ? ar : en}</h3>{!compact && <p>{locale === "ar" ? arDesc : desc}</p>}</article>)}</div>; }
function ServiceGrid({ locale }: { locale: Locale }) { return <div className="marketing-grid">{services.map(([Icon, en, ar, desc, arDesc]) => <article className="marketing-card" key={en}><Icon aria-hidden="true" /><h3>{locale === "ar" ? ar : en}</h3><p>{locale === "ar" ? arDesc : desc}</p></article>)}</div>; }
function Benefits({ items }: { items: [string, string][] }) { return <div className="marketing-benefits">{items.map(([title, body]) => <article className="marketing-card" key={title}><ShieldCheck aria-hidden="true" /><h3>{title}</h3><p>{body}</p></article>)}</div>; }

export function HomeContent({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const faqs = ar ? [
    ["إزاي التجربة المجانية لمدة 14 يوم بتشتغل؟", "ابدأ تجربة المنصة لمدة 14 يوم عشان تتعرف على الأدوات وتشوف مدى مناسبتها لشغلك قبل الدفع."],
    ["هل لازم بيانات دفع عشان أبدأ؟", "راجع شروط التسجيل وقت بدء التجربة، أو اسأل فريقنا عن متطلبات الدفع قبل التسجيل."],
    ["إيه الأسعار بعد التجربة؟", "تواصل معانا لمعرفة الخطة والسعر المناسبين لاحتياجات مؤسستك قبل ما تختار."],
    ["هل فيه التزام بالاشتراك؟", "تقدر تستكشف المنصة في فترة التجربة بدون التزام بشراء خدمات إضافية. راجع شروط الاشتراك والإلغاء عند التسجيل."],
    ["المنصة بتقدم إيه؟", "إدارة الشيفتات والوقت والعملاء والتقويمات والمهام والنماذج والفواتير ووكلاء الذكاء الاصطناعي والأتمتة."],
    ["هل فيه مساعدة مجانية في الإعداد؟", "أيوه، بنساعدك في إعداد الحساب وتنظيم المؤسسة والتجهيز الأولي. نتفق معاك على النطاق حسب احتياجاتك."],
    ["هل أقدر أضيف خدمات بعدين؟", "أيوه، تقدر تبدأ بالمنصة وتطلب خدمات البراندينج والتسويق ودعم الأعمال والمساعدين الافتراضيين وقت ما تحتاجها."],
    ["أبدأ إزاي؟", "اضغط على زر التجربة المجانية، أو تواصل مع الفريق لو محتاج مساعدة في اختيار الحل المناسب."],
  ] : [
    ["How does the 14-day free trial work?", "Try the platform for 14 days to explore its tools and see how they fit your business before paying."],
    ["Do I need payment details to start?", "Check the signup terms when starting your trial, or ask our team about payment requirements before registering."],
    ["What does it cost after the trial?", "Contact us for the plan and pricing that fit your organization before you choose."],
    ["Is there a commitment?", "Explore the platform during your trial without committing to additional services. Review subscription and cancellation terms at signup."],
    ["What does the platform include?", "Shifts, time tracking, CRM, calendars, tasks, forms, invoicing, AI agents and automation."],
    ["Is setup assistance included?", "Yes. We offer free help with account setup, organization structure and initial configuration. We’ll agree the scope around your needs."],
    ["Can I add services later?", "Yes. Start with the platform, then add branding, marketing, business support or virtual assistants when you need them."],
    ["How do I get started?", "Select the free trial button, or talk to our team if you need help choosing the right starting point."],
  ];
  return <SectionScroll>
    <Scene id="top" hero visual={<PlatformVisual locale={locale} />} eyebrow={ar ? "منصة واحدة. احتمالات أكتر." : "ONE PLATFORM. MORE POSSIBILITIES."} title={ar ? "مساحة لأفكارك. نظام لكل شغلك." : "Room for your ideas. A system for everything else."} description={ar ? "اجمع فريقك وأدواتك ومهامك في مكان واحد. قلّل الشغل المتكرر وركّز على تطوير مشروعك." : "Bring your team, tools and workflows together. Spend less time on repetitive work and more time building your business."}>
      <Actions locale={locale} /><p className="marketing-note">{ar ? "تجربة 14 يوم · إعداد مجاني · خدمات وقت ما تحتاجها" : "14-day trial · Free setup · Services when you need them"}</p>
      <div className="marketing-orbit" aria-hidden="true">{[Bot, CalendarDays, Users, Workflow, Clock3].map((Icon, i) => <span key={i} style={{ animationDelay: `${i * -1.2}s` }}><Icon /><span>{["AI", "Calendar", "CRM", "Automation", "Time"][i]}</span></span>)}</div>
    </Scene>
    <Scene id="why-us" eyebrow={ar ? "ليه تختارنا" : "WHY CHOOSE US"} title={ar ? "ابدأ بثقة. جرّب بنفسك." : "Start with confidence. Try it for yourself."} description={ar ? "خد وقتك في استكشاف المنصة واتكلم معانا قبل ما تدفع أي حاجة." : "Take time to explore the platform and talk to us before paying a penny."}>
      <Benefits items={ar ? [["14 يوم للتجربة", "شوف إزاي المنصة تناسب طريقة شغلك قبل الدفع."], ["ابدأ من غير ضغط", "استكشف الأدوات بدون التزام بشراء خدمات إضافية."], ["مساعدة من البداية", "إعداد مجاني، وخدمات إضافية تقدر تستكشفها وقت ما تحتاج."]] : [["14 days to explore", "See how the platform fits your workflow before paying."], ["Start without pressure", "Explore the tools without committing to extra services."], ["Help from day one", "Free setup, plus additional services to explore when you need them."]]} />
      <div className="marketing-actions"><LinkButton href="/services">{ar ? "استكشف الخدمات" : "Explore Our Services"}</LinkButton><LeadButton mode="booking">{ar ? "احجز مكالمة" : "Book a Call"}</LeadButton><LeadButton secondary>{ar ? "تواصل معانا" : "Talk to Us"}</LeadButton></div>
    </Scene>
    <Scene id="problem" eyebrow={ar ? "المشكلة" : "THE PROBLEM"} title={ar ? "أدوات أكتر. وقت أقل لشغلك." : "More tools. Less time for your business."} description={ar ? "لما كل جزء من شغلك موجود في نظام مختلف، فريقك بيقضي وقته في التنقل ونقل البيانات بدل الإنجاز." : "When every part of your business lives in a different system, your team spends time switching tools and moving information instead of moving work forward."}>
      <Benefits items={ar ? [["أنظمة منفصلة", "بيانات العملاء والمواعيد والمهام متوزعة على أدوات مختلفة."], ["شغل يدوي متكرر", "نسخ بيانات ومتابعات وتحديثات بتستهلك مجهودك كل يوم."], ["تكاليف بتتراكم", "اشتراكات وخدمات منفصلة بتزوّد التكلفة وتعقيد الإدارة."]] : [["Disconnected systems", "Customer data, appointments and tasks are scattered across tools."], ["Repetitive manual work", "Copying information, chasing updates and repeating the same steps."], ["Costs that add up", "Separate subscriptions and services increase overhead and complexity."]]} />
    </Scene>
    <Scene id="solution" eyebrow={ar ? "الحل" : "THE SOLUTION"} title={ar ? "كل أدوات شغلك. أخيرًا مع بعض." : "Your business tools. Finally, together."} description={ar ? "نظّم مؤسستك في مكان واحد، اربط خطوات الشغل بالأتمتة، وقلّل الاعتماد على اشتراكات منفصلة." : "Organize your business in one place, connect workflows with automation and reduce reliance on separate subscriptions."}>
      <FeatureGrid locale={locale} compact /><Actions locale={locale} />
    </Scene>
    <Scene id="faq" eyebrow={ar ? "الأسئلة الشائعة" : "GOOD QUESTIONS"} title={ar ? "كل اللي محتاج تعرفه عشان تبدأ." : "A little clarity before you start."}>
      <div className="marketing-faq">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </Scene>
  </SectionScroll>;
}

export function PlatformContent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ar = locale === "ar";
  return <SectionScroll className="marketing-pages platform-product-page">
    <PlatformHero locale={locale} />
    <section id="plans" data-scene className="marketing-scene platform-plans-scene" aria-labelledby="platform-plans-title">
      <div className="marketing-inner">
        <div className="platform-plans-heading"><p className="marketing-eyebrow">{ar ? "خطتك. نقطة بدايتك." : "YOUR PLAN. YOUR STARTING POINT."}</p><h2 id="platform-plans-title" className="marketing-heading">{ar ? "مساحة تناسب المرحلة اللي أنت فيها." : "A little room. A lot of possibility."}</h2><p className="marketing-description">{ar ? "اختار من 3 خطط، وخلينا نساعدك تجهّز تجربتك لمدة 14 يوم." : "Three ways to get started. Choose your plan and let us help you set up your 14-day trial."}</p></div>
        <PlatformPlans locale={locale} dict={dict.contact.form} />
      </div>
    </section>
    <Scene id="features" eyebrow={ar ? "أدوات متصلة" : "CONNECTED TOOLS"} title={ar ? "تفاصيل أقل تتابعها. إنجاز أكتر." : "Less to juggle. More to get done."}><FeatureGrid locale={locale} /></Scene>
    <Scene id="why-sign-up" eyebrow={ar ? "ليه تشترك؟" : "WHY SIGN UP?"} title={ar ? "شغل منظم من أول يوم." : "A more organized business, from day one."} description={ar ? "اجمع أدواتك، وفّر وقت فريقك، وخلّي الأتمتة تقلّل الخطوات المتكررة." : "Bring your tools together, save your team time and let automation reduce repetitive steps."}>
      <Benefits items={ar ? [["حسابك جاهز", "بنساعدك مجانًا في إعداد حسابك والتجهيز الأولي."], ["مؤسستك منظمة", "نساعدك ترتب مؤسستك ومساحة العمل بالشكل المناسب."], ["إعداد يناسبك", "نتفق على احتياجاتك ونساعدك تبدأ. ضيف خدمات متخصصة بعدين لو احتجتها."]] : [["Free account setup", "Get help setting up your account and initial configuration."], ["An organized workspace", "We help you structure your organization and workspace."], ["A starting point that fits", "We agree your needs and help you get started. Add specialist services later if you need them."]]} /><Actions locale={locale} servicesLink />
    </Scene>
    <Scene id="services" eyebrow={ar ? "أكتر من سوفتوير" : "MORE THAN SOFTWARE"} title={ar ? "دعم يساعد مشروعك يكبر." : "Support for what comes next."} description={ar ? "من البراندينج للتسويق ودعم الأعمال، خدمات تكمّل أدواتك." : "From branding and marketing to business support, add services that complement your tools."}><ServiceGrid locale={locale} /><div className="marketing-actions"><LinkButton href="/services">{ar ? "استكشف خدماتنا" : "Explore Our Services"}</LinkButton></div></Scene>
    <Scene id="help" eyebrow={ar ? "إحنا معاك" : "LET’S FIGURE IT OUT"} title={ar ? "مش متأكد مشروعك محتاج إيه؟" : "Not sure what your business needs?"} description={ar ? "احكيلنا عن شغلك وهنساعدك تحدد نقطة البداية المناسبة." : "Tell us about your business. We’ll help you find the right starting point."}><div className="marketing-actions"><LeadButton>{ar ? "تواصل معانا" : "Talk to Us"}</LeadButton></div></Scene>
  </SectionScroll>;
}

export function ServicesContent({ locale, initialService = 0 }: { locale: Locale; initialService?: number }) {
  const ar = locale === "ar";
  return <SectionScroll className="marketing-pages services-wireline">
    <Scene id="top" hero visual={<ServicesPreview locale={locale} />} eyebrow={ar ? "خدمات SPECIALEVEL" : "SPECIALEVEL SERVICES"} title={ar ? "الفريق اللي يساعدك تخطو الخطوة الجاية." : "The support behind your next step."} description={ar ? "إعداد مشروعك على المنصة، بناء الهوية، التسويق، ودعم الأعمال بمساعدين افتراضيين للمكالمات والموديريشن والمهام اليومية." : "Platform setup, branding, marketing and business support—including virtual assistants for calling, moderation and everyday operations."}><div className="marketing-actions"><LeadButton mode="booking">{ar ? "احجز مكالمتك دلوقتي" : "Book Your Call Now"}</LeadButton><LeadButton secondary>{ar ? "اعرف أكتر" : "Learn More"}</LeadButton></div></Scene>
    <Scene id="service-explorer" eyebrow={ar ? "خدمات تناسب شغلك" : "FIND YOUR STARTING POINT"} title={ar ? "اختار الخدمة. شوف التفاصيل." : "Choose a service. See what’s involved."} description={ar ? "من تجهيز المنصة لدعم فريقك اليومي، استكشف التفاصيل وناقش اللي يناسب مشروعك." : "From setting up your platform to supporting your daily operations, explore the details and tell us what your business needs."}><ServiceExplorer key={initialService} locale={locale} initialService={initialService} /></Scene>
    <Scene id="why-us" eyebrow={ar ? "ليه تشتغل معانا؟" : "WHY WORK WITH US"} title={ar ? "نبدأ باحتياجاتك. ونبني عليها." : "Your needs set the direction."}>
      <Benefits items={ar ? [["نتكلم الأول", "ناقش احتياجاتك معانا قبل أي قرار شراء."], ["خدمات مترابطة", "اجمع إعداد المنصة ودعم الأعمال والخدمات الإبداعية حسب احتياجك."], ["ابدأ باللي تحتاجه", "اختار نقطة البداية، وضيف خدمات جديدة وقت ما تكون جاهز."]] : [["A conversation first", "Discuss your needs with us before making a purchase decision."], ["Connected support", "Bring together platform setup, business support and creative services as needed."], ["Start with what you need", "Choose a starting point and add services when you’re ready."]]} />
    </Scene>
    <Scene id="process" eyebrow={ar ? "طريقة الشغل" : "HOW WE WORK TOGETHER"} title={ar ? "من أول مكالمة لخطوة التنفيذ." : "From the first conversation to a clear next step."} description={ar ? "نتفق على المطلوب قبل البداية، ونخلي التواصل واضح خلال المشروع." : "Align on the work before it starts, with clear communication throughout the project."}>
      <ol className="service-process">{(ar ? [["نفهم احتياجك", "احكيلنا عن مشروعك وأهدافك والأدوات اللي بتستخدمها."], ["نحدد النطاق", "نتفق على المطلوب والتكلفة والتوقيت والمسؤوليات قبل البدء."], ["ننّفذ ونراجع", "نشتغل على النطاق المتفق عليه ونراجع التقدم معاك."], ["نسلّم ونخطط للبعده", "نراجع التسليم ونوضح طريقة الاستخدام وأي دعم إضافي مطلوب."]] : [["Discover", "Tell us about your business, goals and the tools you use today."], ["Agree the scope", "Confirm deliverables, pricing, timing and responsibilities before work begins."], ["Build and review", "Work through the agreed scope and review progress together."], ["Hand over and plan ahead", "Review the delivery, clarify how to use it and discuss any additional support."]]).map(([title, text], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol>
      <div className="marketing-actions"><LeadButton mode="booking">{ar ? "احجز مكالمة البداية" : "Book an Intro Call"}</LeadButton></div>
    </Scene>
    {/* Only show evidence sections when approved client material is available. */}
    {testimonials.length > 0 && <Scene id="reviews" eyebrow={ar ? "تجارب العملاء" : "CLIENT EXPERIENCES"} title={ar ? "اختار على أساس شغل يناسب احتياجاتك." : "Make room for an informed decision."} description={ar ? "اسألنا عن تجارب العملاء المرتبطة بالخدمة اللي بتفكر فيها أثناء مكالمتك." : "Ask us about relevant client experiences for the service you’re considering during your call."}>{testimonials.length > 0 && <div className="marketing-benefits">{testimonials.map(item => <figure className="marketing-card" key={item.client + item.service.en}><blockquote>{item.quote[locale]}</blockquote><figcaption className="mt-5 font-semibold">{item.client}{item.company && " · " + item.company}</figcaption><p>{item.service[locale]}</p>{item.result && <p>{item.result[locale]}</p>}</figure>)}</div>}<div className="marketing-actions"><LeadButton mode="booking">{ar ? "ناقش احتياجاتك" : "Discuss Your Needs"}</LeadButton></div></Scene>}
    {projects.length > 0 && <Scene id="portfolio" eyebrow={ar ? "المشاريع" : "PROJECT SHOWCASE"} title={ar ? "خلينا نتكلم عن اللي عايز تبنيه." : "Let’s talk about what you want to build."} description={ar ? "مواقع، صفحات هبوط، Funnels، وأنظمة رقمية. تواصل معانا لمناقشة أمثلة مرتبطة بمشروعك ونطاق العمل المناسب." : "Websites, landing pages, funnels and digital systems. Talk to us about examples relevant to your project and the scope you have in mind."}>{projects.length > 0 && <div className="marketing-benefits">{projects.map(item => <article className="marketing-card" key={item.name}>{item.image && <div role="img" aria-label={item.name} className="mb-5 aspect-video rounded-lg bg-cover bg-center" style={{backgroundImage: 'url("' + item.image + '")'}} />}<h3>{item.name}</h3><p>{item.service[locale]}</p><p>{item.description[locale]}</p>{item.result && <p>{item.result[locale]}</p>}{item.testimonial && <blockquote className="mt-4">{item.testimonial.quote[locale]}<cite className="mt-2 block">{item.testimonial.client}</cite></blockquote>}{item.url && <a className="mt-4 inline-block underline" href={item.url} target="_blank" rel="noopener noreferrer">{ar ? "شوف المشروع" : "View Project"}</a>}</article>)}</div>}<div className="marketing-actions"><LeadButton secondary>{ar ? "اسأل عن شغلنا" : "Ask About Our Work"}</LeadButton></div></Scene>}
    <Scene id="services-faq" eyebrow={ar ? "قبل ما نبدأ" : "BEFORE WE GET STARTED"} title={ar ? "أسئلتك عن الخدمات." : "Questions about working together."}>
      <div className="marketing-faq">{(ar ? [["هل لازم أشترك في المنصة عشان أطلب خدمة؟", "تقدر تناقش خدمات البراندينج والتسويق والمواقع والدعم بشكل مستقل. ولو الخدمة محتاجة المنصة، هنوضح ده عند تحديد النطاق."], ["إزاي بتتحدد الأسعار؟", "بعد ما نفهم الخدمة والمطلوب، نتفق على عرض يشمل النطاق والتكلفة والتوقيت قبل البدء."], ["إيه الفرق بين الإعداد المجاني والخدمات الإضافية؟", "الإعداد المجاني بيساعدك تبدأ بحسابك ومؤسستك والتجهيز الأولي. أي تخصيص أو تنفيذ إضافي بيتحدد ويتسعّر بشكل منفصل."], ["هل أقدر أطلب أكتر من خدمة؟", "أيوه. نقدر نناقش أولوياتك ونحدد ترتيب مناسب للتنفيذ بدل ما تبدأ بكل حاجة مرة واحدة."], ["أجهّز إيه لأول مكالمة؟", "نبذة عن مشروعك، هدفك، الأدوات الحالية، وأي ملفات أو مواعيد مهمة. مش لازم يكون عندك Brief جاهز."], ["هل فيه دعم مستمر؟", "ناقش احتياجك للدعم مع الفريق. نطاق المتابعة وتوافرها بيتحددوا ضمن الاتفاق."]] : [["Do I need the platform to request a service?", "You can discuss branding, marketing, websites and support independently. If a service needs the platform, we’ll explain that when agreeing the scope."], ["How is pricing decided?", "Once we understand the service and deliverables, we agree a proposal covering scope, cost and timing before work begins."], ["How is free setup different from additional services?", "Free setup helps you start with your account, organization and initial configuration. Additional customization or delivery is scoped and priced separately."], ["Can I combine multiple services?", "Yes. We can discuss your priorities and plan a useful order of delivery rather than starting everything at once."], ["What should I bring to the first call?", "A short overview of your business, your goal, existing tools, and any relevant assets or deadlines. You don’t need a finished brief."], ["Is ongoing support available?", "Discuss your support needs with the team. Follow-up scope and availability are agreed as part of the engagement."]]).map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </Scene>
    <Scene id="platform" eyebrow={ar ? "ابدأ بخطوة بسيطة" : "START WITH THE PLATFORM"} title={ar ? "منصتك دلوقتي. خدماتك وقت ما تحتاجها." : "Your platform now. Extra support when you need it."} description={ar ? "مش لازم تبدأ بكل الخدمات مرة واحدة. جرّب المنصة 14 يوم، وبعدها ضيف الخدمات اللي يحتاجها مشروعك." : "You don’t need every service on day one. Try the platform for 14 days, then add the services your business needs."}><div className="marketing-actions"><TrialButton locale={locale} /><LeadButton secondary>{ar ? "اعرف أكتر" : "Learn More"}</LeadButton></div></Scene>
  </SectionScroll>;
}


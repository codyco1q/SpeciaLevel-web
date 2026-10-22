import Link from "next/link";
import { Bot, Building2, Code2, Headphones, Megaphone, Palette, Workflow } from "lucide-react";
import type { Locale } from "@/lib/i18n/get-dictionary";

export function MarketingLogo() {
  return <span className="marketing-logo" role="img" aria-label="SpeciaLevel" />;
}

export function PlatformVisual({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const nodes = [[Building2,"Platform setup","إعداد المنصة",0],[Palette,"Branding","الهوية",1],[Megaphone,"Marketing","التسويق",2],[Code2,"Web & funnels","المواقع والصفحات",3],[Headphones,"Virtual teams","فرق الدعم",4],[Workflow,"Automation","الأتمتة",5]] as const;
  return <div className="platform-visual global-network" aria-label={ar ? "شبكة خدمات SpeciaLevel التفاعلية" : "Interactive SpeciaLevel service network"}>
    <div className="visual-coordinate"><span />SL / GLOBAL OPERATIONS NETWORK <small>LIVE</small></div>
    <svg className="network-map" viewBox="0 0 900 360" preserveAspectRatio="none" aria-hidden="true">
      <g className="world-wireframe">
        <path d="M73 120l45-35 64 8 27 30-22 26 18 31-44 29-61-14-20-37zm173-55 37-20 44 16 8 34-28 20-44-8zm142 72 53-31 54 10 19 33-25 35-54 4-36-22zm139-78 58-21 71 16 20 36-37 31-72-9-33-27zm34 150 61-22 75 20 23 43-44 45-74-10-33-38zm-223 44 42-24 62 16 17 42-42 33-64-11-23-30z" />
        <path d="M25 90h850M18 180h864M35 270h830M150 22v316M300 12v336M450 8v344M600 12v336M750 22v316" className="map-grid-lines" />
      </g>
      <g className="network-routes">
        <path d="M450 180C365 160 315 106 220 106"/><path d="M450 180C365 190 315 240 238 240"/><path d="M450 180C425 220 390 250 345 262"/><path d="M450 180C475 220 540 250 585 262"/><path d="M450 180C535 190 615 240 691 240"/><path d="M450 180C535 160 615 106 700 106"/>
      </g>
      <g className="network-signals"><circle r="3"><animateMotion dur="4.2s" repeatCount="indefinite" path="M450 180C365 160 315 106 220 106" /></circle><circle r="3"><animateMotion dur="5.1s" repeatCount="indefinite" path="M450 180C535 190 615 240 691 240" /></circle><circle r="3"><animateMotion dur="4.7s" repeatCount="indefinite" path="M450 180C425 220 390 250 345 262" /></circle></g>
    </svg>
    <div className="network-core"><span className="network-core-ring"/><span className="network-brand-icon" role="img" aria-label={ar ? "شعار SpeciaLevel" : "SpeciaLevel symbol"}/></div>
    <div className="network-nodes">{nodes.map(([Icon,en,arabic,index],i)=><Link href={`/services?service=${index}#service-explorer`} className={`network-node network-node-${i}`} key={en}><span className="network-node-icon"><Icon /></span><span><strong>{ar ? arabic : en}</strong><small>{ar ? "افتح الخدمة" : "Open service"}</small></span><i /><b>0{i+1}</b></Link>)}</div>
    <div className="visual-caption"><Bot size={15}/><span>{ar ? "اختار أي نقطة واكتشف الخدمة" : "Choose any point to explore the service"}</span><span className="network-telemetry">06 NODES · 01 SYSTEM</span></div>
  </div>;
}

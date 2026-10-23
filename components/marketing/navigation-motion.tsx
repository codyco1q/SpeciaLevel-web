"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Keep modified clicks native; animate only the three marketing routes. */
export function NavigationMotion() {
  const pathname = usePathname();
  const router = useRouter();
  const light = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const page = document.querySelector<HTMLElement>(".marketing-shell main");
    if (!matchMedia("(prefers-reduced-motion: reduce), (max-width: 800px)").matches) {
      page?.animate([{ opacity: 0, transform: "translateY(16px)", filter: "blur(4px)" }, { opacity: 1, transform: "translateY(0)", filter: "blur(0)" }], { duration: 550, easing: "cubic-bezier(.16,1,.3,1)" });
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    let navigating = false;
    let recovery: ReturnType<typeof setTimeout> | undefined;
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || !anchor.closest(".marketing-shell") || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || !["/", "/platform", "/services"].includes(url.pathname)) return;
      if (matchMedia("(prefers-reduced-motion: reduce), (max-width: 800px)").matches) return;
      light.current?.animate([{ opacity: 0, transform: "translateX(-110%)" }, { opacity: .8, offset: .4 }, { opacity: 0, transform: "translateX(110%)" }], { duration: 650, easing: "ease-in-out" });
      if (url.pathname === pathname) return;
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      page?.animate([{ opacity: 1, transform: "translateY(0)" }, { opacity: .15, transform: "translateY(-8px)" }], { duration: 180, fill: "forwards", easing: "ease-out" });
      timer = setTimeout(() => {
        router.push(url.pathname + url.search + url.hash);
        recovery = setTimeout(() => { page?.getAnimations().forEach(animation => animation.cancel()); navigating = false; }, 2500);
      }, 170);
    };
    document.addEventListener("click", click, true);
    return () => { document.removeEventListener("click", click, true); if (timer) clearTimeout(timer); if (recovery) clearTimeout(recovery); page?.getAnimations().forEach(animation => animation.cancel()); };
  }, [pathname, router]);
  return <div ref={light} className="marketing-route-light" aria-hidden="true" />;
}


import { HomeContent } from "@/components/marketing/page-content";
import { getLocale } from "@/lib/i18n/get-dictionary";
export default async function MarketingPage() { return <HomeContent locale={await getLocale()} />; }

import { PlatformContent } from "@/components/marketing/page-content";
import "./platform-mobile.css";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";
export const metadata = { title: "SpeciaLevel | Platform" };
export default async function Page() { return <PlatformContent locale={await getLocale()} dict={await getDictionary()} />; }

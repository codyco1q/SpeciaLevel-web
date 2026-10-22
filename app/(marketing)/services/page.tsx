import { ServicesContent } from "@/components/marketing/page-content";
import { getLocale } from "@/lib/i18n/get-dictionary";
export const metadata = { title: "SpeciaLevel | Services" };
export default async function Page({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const { service } = await searchParams;
  const initialService = typeof service === "string" ? Number(service) : 0;
  return <ServicesContent locale={await getLocale()} initialService={initialService} />;
}

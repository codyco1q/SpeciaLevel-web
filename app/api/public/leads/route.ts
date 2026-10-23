import { NextResponse } from "next/server";
import { saveMarketingLead } from "@/lib/marketing-leads";
import { marketingLeadSchema } from "@/lib/validations/marketing-leads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  const parsed = marketingLeadSchema.safeParse(data);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid lead details" },
      { status: 400 }
    );
  }

  const locale = (data as Record<string, unknown>).locale === "ar" ? "ar" : "en";
  try {
    await saveMarketingLead({
      ...parsed.data,
      locale,
      submittedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/public/leads] Unable to save lead:", error);
    return NextResponse.json(
      { success: false, error: "Unable to save your request. Please try again." },
      { status: 503 }
    );
  }
}

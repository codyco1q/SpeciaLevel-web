<<<<<<< HEAD
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const lead = {
      ...data,
      receivedAt: new Date().toISOString(),
    };

    // Store to local fallback
    try {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(
        path.join(dir, "marketing-leads.jsonl"),
        `${JSON.stringify(lead)}\n`,
        "utf8"
      );
    } catch (fsError) {
      console.error("[api/public/leads] File append error:", fsError);
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[api/public/leads] Error processing lead:", error);
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
=======
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
>>>>>>> f0c90fc (Latest Front End)

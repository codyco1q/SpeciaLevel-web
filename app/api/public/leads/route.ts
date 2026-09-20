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

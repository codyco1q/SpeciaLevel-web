import "server-only";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { MarketingLeadFormValues } from "./validations/marketing-leads";

export type MarketingLead = MarketingLeadFormValues & {
  locale: "en" | "ar";
  submittedAt: string;
};

export async function saveMarketingLead(lead: MarketingLead) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "marketing-leads.jsonl"),
    `${JSON.stringify(lead)}\n`,
    "utf8"
  );
}

/** Await delivery so a failed webhook cannot produce a false success. */
async function forwardLead(url: string, payload: object) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`Lead destination returned ${response.status}`);
}

export async function deliverMarketingLead(lead: MarketingLead) {
  // Use an explicit ingestion URL, never the marketing site's own default URL.
  const apiUrl = process.env.MARKETING_LEADS_API_URL;
  const webhookUrl = process.env.MARKETING_LEADS_WEBHOOK_URL;
  const deliveries: Promise<void>[] = [saveMarketingLead(lead)];
  if (apiUrl) deliveries.push(forwardLead(apiUrl, lead));
  if (webhookUrl) {
    deliveries.push(forwardLead(webhookUrl, { event: "marketing.lead_created", ...lead }));
  }

  const results = await Promise.allSettled(deliveries);
  results.forEach(result => {
    if (result.status === "rejected") {
      console.error("[marketing-leads] Delivery failed:", result.reason);
    }
  });
  return results.some(result => result.status === "fulfilled");
}

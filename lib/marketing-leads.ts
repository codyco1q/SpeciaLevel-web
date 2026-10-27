import "server-only";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { MarketingLeadFormValues } from "./validations/marketing-leads";
import {
  sendContactNotificationToAdmin,
  sendContactConfirmationToUser,
} from "./brevo";
import { sendContactNotificationToTelegram } from "./telegram";

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

async function forwardExternal(task: Promise<{ success: boolean; error?: string }>) {
  const result = await task;
  if (!result.success) throw new Error(result.error || "Delivery failed");
}

export async function deliverMarketingLead(lead: MarketingLead) {
  const apiUrl = process.env.MARKETING_LEADS_API_URL;
  const webhookUrl = process.env.MARKETING_LEADS_WEBHOOK_URL;

  const deliveries: Promise<unknown>[] = [
    saveMarketingLead(lead),
    forwardExternal(sendContactNotificationToAdmin(lead)),
    forwardExternal(sendContactConfirmationToUser(lead)),
    forwardExternal(sendContactNotificationToTelegram(lead)),
  ];

  if (apiUrl) deliveries.push(forwardLead(apiUrl, lead));
  if (webhookUrl) {
    deliveries.push(
      forwardLead(webhookUrl, { event: "marketing.lead_created", ...lead })
    );
  }

  const results = await Promise.allSettled(deliveries);
  results.forEach(result => {
    if (result.status === "rejected") {
      console.error("[marketing-leads] Delivery failed:", result.reason);
    }
  });

  // Local storage (index 0) or any valid destination fulfilling marks success
  return results[0].status === "fulfilled" || results.some(r => r.status === "fulfilled");
}

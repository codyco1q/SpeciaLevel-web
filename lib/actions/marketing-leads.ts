<<<<<<< HEAD
"use server";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import {
  createMarketingLeadSchema,
  type MarketingLeadState,
} from "@/lib/validations/marketing-leads";
import {
  getDictionary,
  getLocale,
  type Locale,
} from "@/lib/i18n/get-dictionary";

function parseFieldErrors(
  issues: z.ZodIssue[]
): MarketingLeadState["fieldErrors"] {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      (fieldErrors[key] ??= []).push(issue.message);
    }
  }
  return fieldErrors;
}

/**
 * Public lead submission action for the SpeciaLevel marketing website.
 * Validates the form payload, then dispatches the lead directly to the
 * SaaS app's public lead endpoint:
 *   `${process.env.NEXT_PUBLIC_APP_URL}/api/public/leads`
 *
 * Also supports optional webhook forwarding and local JSONL fallback
 * persistence so no lead is lost.
 */
export async function submitMarketingLead(
  _prevState: MarketingLeadState,
  formData: FormData
): Promise<MarketingLeadState> {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    bottleneck: formData.get("bottleneck"),
    packageOfInterest: formData.get("packageOfInterest"),
  };

  const dict = await getDictionary();
  const locale = await getLocale();
  const parsed = createMarketingLeadSchema(dict.contact.form).safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      error: null,
      fieldErrors: parseFieldErrors(parsed.error.issues),
    };
  }

  const lead = {
    ...parsed.data,
    locale,
    submittedAt: new Date().toISOString(),
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const apiEndpoint = `${appUrl.replace(/\/$/, "")}/api/public/leads`;
  const webhookUrl = process.env.MARKETING_LEADS_WEBHOOK_URL;

  let leadHandled = false;

  // 1) Primary dispatch: POST directly to SaaS lead ingestion API
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      leadHandled = true;
    } else {
      console.warn(
        `[marketing-leads] SaaS API endpoint (${apiEndpoint}) responded with status ${response.status}`
      );
    }
  } catch (error) {
    console.warn(
      `[marketing-leads] Failed to reach SaaS lead endpoint (${apiEndpoint}):`,
      error
    );
  }

  // 2) Outbound webhook dispatch if configured (e.g. Make.com, Zapier, Slack webhook)
  if (webhookUrl) {
    try {
      void fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "marketing.lead_created",
          ...lead,
        }),
        signal: AbortSignal.timeout(5000),
      }).catch((err) => {
        console.error("[marketing-leads] Webhook dispatch error:", err);
      });
      leadHandled = true;
    } catch (err) {
      console.error("[marketing-leads] Webhook trigger error:", err);
    }
  }

  // 3) Fallback local JSONL store so submissions are resilient against offline backend
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "marketing-leads.jsonl"),
      `${JSON.stringify(lead)}\n`,
      "utf8"
    );
    leadHandled = true;
  } catch (err) {
    console.error("[marketing-leads] Local JSONL write failed:", err);
  }

  if (!leadHandled) {
    return {
      status: "error",
      error: dict.contact.form.submitError,
    };
  }

  return { status: "success" };
}
=======
"use server";

import { deliverMarketingLead } from "@/lib/marketing-leads";
import { z } from "zod";

import {
  createMarketingLeadSchema,
  type MarketingLeadState,
} from "@/lib/validations/marketing-leads";
import {
  getDictionary,
  getLocale,
} from "@/lib/i18n/get-dictionary";

function parseFieldErrors(
  issues: z.ZodIssue[]
): MarketingLeadState["fieldErrors"] {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      (fieldErrors[key] ??= []).push(issue.message);
    }
  }
  return fieldErrors;
}

/** Validate and deliver a lead, with a single local archive write. */
export async function submitMarketingLead(
  _prevState: MarketingLeadState,
  formData: FormData
): Promise<MarketingLeadState> {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    bottleneck: formData.get("bottleneck"),
    packageOfInterest: formData.get("packageOfInterest"),
  };

  const dict = await getDictionary();
  const locale = await getLocale();
  const parsed = createMarketingLeadSchema(dict.contact.form).safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      error: null,
      fieldErrors: parseFieldErrors(parsed.error.issues),
    };
  }

  const lead = {
    ...parsed.data,
    locale,
    submittedAt: new Date().toISOString(),
  };

  const leadHandled = await deliverMarketingLead(lead);

  if (!leadHandled) {
    return {
      status: "error",
      error: dict.contact.form.submitError,
    };
  }

  return { status: "success" };
}
>>>>>>> f0c90fc (Latest Front End)

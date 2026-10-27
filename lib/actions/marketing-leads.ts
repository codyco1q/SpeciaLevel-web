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

/** Validate and deliver a lead, with local archive write and Brevo email notifications. */
export async function submitMarketingLead(
  _prevState: MarketingLeadState,
  formData: FormData
): Promise<MarketingLeadState> {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
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

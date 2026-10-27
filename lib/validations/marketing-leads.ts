import { z } from "zod";

/**
 * Shared Zod schema for the SpeciaLevel marketing lead form.
 * Used both client-side (react-hook-form resolver) and server-side
 * (secure re-validation in the server action).
 */

export const MARKETING_PACKAGE_OPTIONS = [
  { value: "marketing", label: "Marketing" },
  { value: "tech-and-automation", label: "Tech and Automation" },
  { value: "virtual-assistance", label: "Virtual Assistance" },
] as const;

export type MarketingPackageValue = (typeof MARKETING_PACKAGE_OPTIONS)[number]["value"];

/** Localized string messages consumed by the lead form schema. */
export interface MarketingLeadMessages {
  fieldNameMin: string;
  fieldNameMax: string;
  fieldEmailInvalid: string;
  fieldCompanyMin?: string;
  fieldCompanyMax: string;
}

export const DEFAULT_MARKETING_LEAD_MESSAGES: MarketingLeadMessages = {
  fieldNameMin: "Please enter your full name.",
  fieldNameMax: "Name must be 120 characters or fewer.",
  fieldEmailInvalid: "Please enter a valid email address.",
  fieldCompanyMin: "Please enter your company name.",
  fieldCompanyMax: "Company must be 150 characters or fewer.",
};

export function createMarketingLeadSchema(
  messages: MarketingLeadMessages = DEFAULT_MARKETING_LEAD_MESSAGES
) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, messages.fieldNameMin)
      .max(120, messages.fieldNameMax),
    company: z
      .string()
      .trim()
      .max(150, messages.fieldCompanyMax)
      .optional(),
    email: z.string().trim().email(messages.fieldEmailInvalid),
    packageOfInterest: z.enum([
      "marketing",
      "tech-and-automation",
      "virtual-assistance",
      "tech and automation",
      "virtual assistance",
    ]),
  });
}

export const marketingLeadSchema = createMarketingLeadSchema();

export type MarketingLeadFormValues = z.infer<
  ReturnType<typeof createMarketingLeadSchema>
>;

/**
 * State returned by the submitMarketingLead server action.
 * Consumed by useActionState in the contact form.
 */
export interface MarketingLeadState {
  status: "idle" | "success" | "error";
  error?: string | null;
  fieldErrors?: Partial<
    Record<keyof MarketingLeadFormValues, string[] | undefined>
  >;
}

export const initialMarketingLeadState: MarketingLeadState = {
  status: "idle",
};

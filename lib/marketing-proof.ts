// Add only client-approved material from Ahmed, Ibrahim and the owner's portfolio.
// Empty collections intentionally render an inquiry invitation instead of invented evidence.
type Localized = { en: string; ar: string };
export type Testimonial = { client: string; company?: string; service: Localized; quote: Localized; result?: Localized };
export type Project = { name: string; service: Localized; description: Localized; image?: string; url?: string; result?: Localized; testimonial?: Testimonial };
export const testimonials: Testimonial[] = [];
export const projects: Project[] = [];

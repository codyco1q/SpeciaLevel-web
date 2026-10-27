import { z } from "zod";

export const BOOKING_TIME_SLOTS = [
  "09:00 AM ET",
  "10:00 AM ET",
  "11:00 AM ET",
  "12:00 PM ET",
  "01:00 PM ET",
  "02:00 PM ET",
  "03:00 PM ET",
  "04:00 PM ET",
  "05:00 PM ET",
] as const;

export type BookingTimeSlot = (typeof BOOKING_TIME_SLOTS)[number];

export interface BookingMessages {
  firstNameMin?: string;
  lastNameMin?: string;
  emailInvalid?: string;
  phoneInvalid?: string;
  dateRequired?: string;
  dateWeekend?: string;
  datePast?: string;
  timeSlotRequired?: string;
}

export const DEFAULT_BOOKING_MESSAGES: BookingMessages = {
  firstNameMin: "Please enter your first name.",
  lastNameMin: "Please enter your last name.",
  emailInvalid: "Please enter a valid email address.",
  phoneInvalid: "Please enter a valid phone number (at least 7 digits).",
  dateRequired: "Please select a date for your consultation.",
  dateWeekend: "Consultations are available on weekdays only (Monday – Friday).",
  datePast: "Please select an upcoming date.",
  timeSlotRequired: "Please select a time slot.",
};

export function isWeekday(dateStr: string): boolean {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return false;
  const d = new Date(year, month - 1, day);
  const dayOfWeek = d.getDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6; // Not Sunday (0) and not Saturday (6)
}

export function isNotPast(dateStr: string): boolean {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return false;
  const target = new Date(year, month - 1, day, 23, 59, 59);
  return target.getTime() >= Date.now();
}

export function createBookingSchema(messages: BookingMessages = DEFAULT_BOOKING_MESSAGES) {
  return z.object({
    firstName: z
      .string()
      .trim()
      .min(2, messages.firstNameMin || DEFAULT_BOOKING_MESSAGES.firstNameMin)
      .max(60),
    lastName: z
      .string()
      .trim()
      .min(2, messages.lastNameMin || DEFAULT_BOOKING_MESSAGES.lastNameMin)
      .max(60),
    email: z
      .string()
      .trim()
      .email(messages.emailInvalid || DEFAULT_BOOKING_MESSAGES.emailInvalid),
    phone: z
      .string()
      .trim()
      .min(7, messages.phoneInvalid || DEFAULT_BOOKING_MESSAGES.phoneInvalid)
      .max(30)
      .regex(/^[0-9+\s().-]+$/, messages.phoneInvalid || DEFAULT_BOOKING_MESSAGES.phoneInvalid),
    date: z
      .string()
      .min(1, messages.dateRequired || DEFAULT_BOOKING_MESSAGES.dateRequired)
      .refine(isWeekday, {
        message: messages.dateWeekend || DEFAULT_BOOKING_MESSAGES.dateWeekend,
      })
      .refine(isNotPast, {
        message: messages.datePast || DEFAULT_BOOKING_MESSAGES.datePast,
      }),
    timeSlot: z
      .string()
      .min(1, messages.timeSlotRequired || DEFAULT_BOOKING_MESSAGES.timeSlotRequired)
      .refine((val) => BOOKING_TIME_SLOTS.includes(val as BookingTimeSlot), {
        message: messages.timeSlotRequired || DEFAULT_BOOKING_MESSAGES.timeSlotRequired,
      }),
  });
}

export const bookingSchema = createBookingSchema();

export type BookingFormValues = z.infer<typeof bookingSchema>;

export interface BookingState {
  status: "idle" | "success" | "error";
  error?: string | null;
  fieldErrors?: Partial<Record<keyof BookingFormValues, string[] | undefined>>;
  bookingDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    date: string;
    timeSlot: string;
  };
}

export const initialBookingState: BookingState = {
  status: "idle",
};

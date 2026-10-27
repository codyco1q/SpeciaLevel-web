"use server";

import { deliverBooking } from "@/lib/bookings";
import { z } from "zod";
import {
  createBookingSchema,
  type BookingState,
} from "@/lib/validations/booking";
import { getDictionary, getLocale } from "@/lib/i18n/get-dictionary";

function parseFieldErrors(issues: z.ZodIssue[]): BookingState["fieldErrors"] {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string") {
      (fieldErrors[key] ??= []).push(issue.message);
    }
  }
  return fieldErrors;
}

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const payload = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    date: formData.get("date"),
    timeSlot: formData.get("timeSlot"),
  };

  const locale = await getLocale();
  const dict = await getDictionary();
  const bookingDict = (dict as Record<string, unknown>).booking as Record<string, string> | undefined;

  const parsed = createBookingSchema({
    firstNameMin: bookingDict?.firstNameMin,
    lastNameMin: bookingDict?.lastNameMin,
    emailInvalid: bookingDict?.emailInvalid,
    phoneInvalid: bookingDict?.phoneInvalid,
    dateRequired: bookingDict?.dateRequired,
    dateWeekend: bookingDict?.dateWeekend,
    datePast: bookingDict?.datePast,
    timeSlotRequired: bookingDict?.timeSlotRequired,
  }).safeParse(payload);

  if (!parsed.success) {
    return {
      status: "error",
      error: null,
      fieldErrors: parseFieldErrors(parsed.error.issues),
    };
  }

  const booking = {
    ...parsed.data,
    locale,
    submittedAt: new Date().toISOString(),
  };

  const success = await deliverBooking(booking);
  if (!success) {
    return {
      status: "error",
      error:
        bookingDict?.errorMessage ||
        "Unable to schedule your consultation right now. Please try again or email hello@specialevel.com.",
    };
  }

  return {
    status: "success",
    bookingDetails: {
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      timeSlot: booking.timeSlot,
    },
  };
}

import "server-only";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { BookingFormValues } from "./validations/booking";
import {
  sendBookingNotificationToAdmin,
  sendBookingConfirmationToUser,
} from "./brevo";
import { sendBookingNotificationToTelegram } from "./telegram";

export type Booking = BookingFormValues & {
  locale: "en" | "ar";
  submittedAt: string;
};

export async function saveBooking(booking: Booking) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "bookings.jsonl"),
    `${JSON.stringify(booking)}\n`,
    "utf8"
  );
}

async function forwardExternal(task: Promise<{ success: boolean; error?: string }>) {
  const result = await task;
  if (!result.success) throw new Error(result.error || "Delivery failed");
}

export async function deliverBooking(booking: Booking): Promise<boolean> {
  const deliveries: Promise<unknown>[] = [
    saveBooking(booking),
    forwardExternal(sendBookingNotificationToAdmin(booking)),
    forwardExternal(sendBookingConfirmationToUser(booking)),
    forwardExternal(sendBookingNotificationToTelegram(booking)),
  ];

  const results = await Promise.allSettled(deliveries);
  results.forEach((result, idx) => {
    if (result.status === "rejected") {
      console.error(`[bookings] Delivery task ${idx} failed:`, result.reason);
    }
  });

  return results[0].status === "fulfilled" || results.some((r) => r.status === "fulfilled");
}

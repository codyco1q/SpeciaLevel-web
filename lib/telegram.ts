import "server-only";

import type { ContactLeadPayload, BookingPayload } from "./brevo";

interface TelegramConfig {
  botToken: string | undefined;
  chatId: string | undefined;
}

let cachedChatId: string | undefined = undefined;

function getTelegramConfig(): TelegramConfig {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || cachedChatId;
  return { botToken, chatId };
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function packageLabel(pkg: string): string {
  switch (pkg) {
    case "marketing":
      return "Marketing";
    case "tech-and-automation":
    case "tech and automation":
      return "Tech & Automation";
    case "virtual-assistance":
    case "virtual assistance":
      return "Virtual Assistance";
    default:
      return pkg;
  }
}

/**
 * If TELEGRAM_CHAT_ID is not configured in env, automatically try to discover
 * the latest chat ID of whoever interacted with the bot via getUpdates.
 */
async function resolveChatId(botToken: string): Promise<string | undefined> {
  const { chatId } = getTelegramConfig();
  if (chatId) return chatId;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return undefined;

    const data = (await res.json()) as {
      ok: boolean;
      result?: Array<{
        message?: { chat?: { id?: number | string } };
        channel_post?: { chat?: { id?: number | string } };
      }>;
    };

    if (data.ok && Array.isArray(data.result) && data.result.length > 0) {
      const lastUpdate = data.result[data.result.length - 1];
      const discoveredId =
        lastUpdate.message?.chat?.id ?? lastUpdate.channel_post?.chat?.id;
      if (discoveredId !== undefined) {
        cachedChatId = String(discoveredId);
        console.log(`[telegram] Automatically discovered chat ID: ${cachedChatId}`);
        return cachedChatId;
      }
    }
  } catch (error) {
    console.error("[telegram] Failed to fetch getUpdates:", error);
  }

  return undefined;
}

export async function sendTelegramMessage(
  htmlText: string
): Promise<{ success: boolean; error?: string }> {
  const { botToken } = getTelegramConfig();
  if (!botToken) {
    return { success: false, error: "Missing TELEGRAM_BOT_TOKEN" };
  }

  const chatId = await resolveChatId(botToken);
  if (!chatId) {
    console.warn(
      "[telegram] Skipped message: No TELEGRAM_CHAT_ID configured and no updates found. Please send /start to @codys_assistant_bot."
    );
    return {
      success: false,
      error: "No chat ID available. Send /start to @codys_assistant_bot.",
    };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: htmlText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[telegram] API error ${res.status}: ${errText}`);
      return { success: false, error: `Telegram returned ${res.status}: ${errText}` };
    }

    return { success: true };
  } catch (error) {
    console.error("[telegram] Failed to send message:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendContactNotificationToTelegram(
  lead: ContactLeadPayload
): Promise<{ success: boolean; error?: string }> {
  const pkg = packageLabel(lead.packageOfInterest);
  const company = lead.company ? escapeHtml(lead.company) : "None (Solo)";

  const message = [
    `⚡ <b>New Contact Form Submission</b>`,
    ``,
    `👤 <b>Name:</b> ${escapeHtml(lead.name)}`,
    `📧 <b>Email:</b> ${escapeHtml(lead.email)}`,
    `🏢 <b>Company:</b> ${company}`,
    `📦 <b>Package:</b> ${pkg}`,
    `🌐 <b>Language:</b> ${lead.locale.toUpperCase()}`,
    `⏰ <b>Date:</b> ${new Date(lead.submittedAt).toUTCString()}`,
  ].join("\n");

  return sendTelegramMessage(message);
}

export async function sendBookingNotificationToTelegram(
  booking: BookingPayload
): Promise<{ success: boolean; error?: string }> {
  const message = [
    `📅 <b>New Consultation Booking</b>`,
    ``,
    `👤 <b>Name:</b> ${escapeHtml(booking.firstName)} ${escapeHtml(booking.lastName)}`,
    `📧 <b>Email:</b> ${escapeHtml(booking.email)}`,
    `📞 <b>Phone:</b> ${escapeHtml(booking.phone)}`,
    `🗓 <b>Date:</b> ${escapeHtml(booking.date)}`,
    `⏰ <b>Time Slot:</b> ${escapeHtml(booking.timeSlot)}`,
    `🌐 <b>Language:</b> ${booking.locale.toUpperCase()}`,
    `⏰ <b>Date:</b> ${new Date(booking.submittedAt).toUTCString()}`,
  ].join("\n");

  return sendTelegramMessage(message);
}

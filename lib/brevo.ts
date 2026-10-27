import "server-only";

export interface ContactLeadPayload {
  name: string;
  email: string;
  company: string;
  packageOfInterest: string;
  locale: "en" | "ar";
  submittedAt: string;
}

export interface BookingPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  locale: "en" | "ar";
  submittedAt: string;
}

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "codyco1q@gmail.com";
  const senderName = process.env.BREVO_SENDER_NAME || "SpeciaLevel";
  const adminEmail = process.env.NOTIFICATION_EMAIL || "codyco1q@gmail.com";
  return { apiKey, senderEmail, senderName, adminEmail };
}

async function sendBrevoEmail(payload: {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo?: { email: string; name?: string };
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { apiKey, senderEmail, senderName } = getBrevoConfig();
  if (!apiKey) {
    console.warn("[brevo] Skipped sending email: BREVO_API_KEY not configured.");
    return { success: false, error: "Missing BREVO_API_KEY" };
  }

  try {
    const res = await fetch(BREVO_ENDPOINT, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: payload.to,
        replyTo: payload.replyTo,
        subject: payload.subject,
        htmlContent: payload.htmlContent,
        textContent: payload.textContent,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[brevo] API error ${res.status}: ${errText}`);
      return { success: false, error: `Brevo returned ${res.status}: ${errText}` };
    }

    const data = (await res.json().catch(() => ({}))) as { messageId?: string };
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("[brevo] Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
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

/** 1. Notification to Cody when someone submits Contact form */
export async function sendContactNotificationToAdmin(lead: ContactLeadPayload) {
  const { adminEmail } = getBrevoConfig();
  const pkg = packageLabel(lead.packageOfInterest);

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e5e7eb; padding: 24px; margin: 0;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="border-bottom: 1px solid #1f2937; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="color: #10b981; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.02em;">New Contact Request</h2>
      <p style="color: #9ca3af; font-size: 13px; margin: 4px 0 0 0;">Received via SpeciaLevel Web Form</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; width: 140px; font-weight: 500;">Full Name</td>
        <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${lead.name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Email</td>
        <td style="padding: 10px 0; color: #60a5fa;"><a href="mailto:${lead.email}" style="color: #60a5fa; text-decoration: none;">${lead.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Company</td>
        <td style="padding: 10px 0; color: #ffffff;">${lead.company || "—"}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Package of Interest</td>
        <td style="padding: 10px 0; color: #34d399; font-weight: 600;">${pkg}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Language / Locale</td>
        <td style="padding: 10px 0; color: #ffffff; text-transform: uppercase;">${lead.locale}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Time</td>
        <td style="padding: 10px 0; color: #9ca3af; font-size: 12px;">${new Date(lead.submittedAt).toUTCString()}</td>
      </tr>
    </table>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937;">
      <a href="mailto:${lead.email}?subject=${encodeURIComponent(`Re: Your SpeciaLevel inquiry - ${pkg}`)}" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Reply to ${lead.name}</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
New Contact Request - SpeciaLevel

Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company}
Package: ${pkg}
Locale: ${lead.locale}
Submitted: ${lead.submittedAt}
  `.trim();

  return sendBrevoEmail({
    to: [{ email: adminEmail, name: "SpeciaLevel Admin" }],
    replyTo: { email: lead.email, name: lead.name },
    subject: `New Contact Request: ${lead.name} (${lead.company || pkg})`,
    htmlContent: html,
    textContent: text,
  });
}

/** 2. Confirmation email to the person who submitted the Contact form */
export async function sendContactConfirmationToUser(lead: ContactLeadPayload) {
  const pkg = packageLabel(lead.packageOfInterest);
  const isAr = lead.locale === "ar";

  const subject = isAr
    ? `تم استلام طلبك — SpeciaLevel`
    : `We received your request — SpeciaLevel`;

  const html = isAr
    ? `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e5e7eb; padding: 24px; margin: 0; text-align: right;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <h1 style="color: #10b981; font-size: 22px; margin: 0 0 12px 0; font-weight: 700;">SpeciaLevel</h1>
    <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">أهلاً ${lead.name}،</h2>
    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0;">
      شكرًا لتواصلك معنا! لقد استلمنا رسالتك بخصوص <strong>${pkg}</strong>، وسيقوم فريقنا بمراجعة تفاصيل طلبك والرد عليك خلال يوم عمل واحد.
    </p>
    <div style="background-color: #1a2234; border: 1px solid #2d3748; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;"><strong>الخدمة المختارة:</strong> ${pkg}</p>
      <p style="margin: 0; font-size: 13px; color: #9ca3af;"><strong>الشركة:</strong> ${lead.company || "—"}</p>
    </div>
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
      إذا كان لديك أي تفاصيل إضافية تود مشاركتها، يمكنك ببساطة الرد على هذا البريد الإلكتروني.
    </p>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; color: #6b7280; font-size: 12px;">
      فريق SpeciaLevel · <a href="https://specialevel.com" style="color: #10b981; text-decoration: none;">specialevel.com</a>
    </div>
  </div>
</body>
</html>
    `.trim()
    : `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e5e7eb; padding: 24px; margin: 0;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <h1 style="color: #10b981; font-size: 22px; margin: 0 0 12px 0; font-weight: 700;">SpeciaLevel</h1>
    <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">Hi ${lead.name},</h2>
    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0;">
      Thank you for reaching out to SpeciaLevel! We received your request regarding <strong>${pkg}</strong>. Our team is reviewing your requirements and will follow up within one business day.
    </p>
    <div style="background-color: #1a2234; border: 1px solid #2d3748; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #9ca3af;"><strong>Package of Interest:</strong> ${pkg}</p>
      <p style="margin: 0; font-size: 13px; color: #9ca3af;"><strong>Company:</strong> ${lead.company || "—"}</p>
    </div>
    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
      If there is anything urgent or any details you would like to add beforehand, feel free to reply directly to this email.
    </p>
    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; color: #6b7280; font-size: 12px;">
      The SpeciaLevel Team · <a href="https://specialevel.com" style="color: #10b981; text-decoration: none;">specialevel.com</a>
    </div>
  </div>
</body>
</html>
    `.trim();

  const text = isAr
    ? `أهلاً ${lead.name}، شكرًا لتواصلك مع SpeciaLevel. لقد استلمنا رسالتك بخصوص ${pkg} وسنرد عليك خلال يوم عمل واحد.`
    : `Hi ${lead.name},\n\nThank you for reaching out to SpeciaLevel! We received your request regarding ${pkg}. Our team will review your project and get back to you within one business day.\n\nBest regards,\nThe SpeciaLevel Team`;

  return sendBrevoEmail({
    to: [{ email: lead.email, name: lead.name }],
    subject,
    htmlContent: html,
    textContent: text,
  });
}

/** 3. Notification to Cody when someone books a call */
export async function sendBookingNotificationToAdmin(booking: BookingPayload) {
  const { adminEmail } = getBrevoConfig();
  const fullName = `${booking.firstName} ${booking.lastName}`.trim();

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e5e7eb; padding: 24px; margin: 0;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="border-bottom: 1px solid #1f2937; padding-bottom: 16px; margin-bottom: 20px;">
      <h2 style="color: #10b981; font-size: 20px; margin: 0; font-weight: 700;">New Consultation Booked</h2>
      <p style="color: #9ca3af; font-size: 13px; margin: 4px 0 0 0;">A new call has been scheduled on the website</p>
    </div>

    <div style="background-color: #064e3b; border: 1px solid #059669; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
      <p style="color: #a7f3d0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 4px 0; font-weight: 700;">Scheduled Date & Time</p>
      <p style="color: #ffffff; font-size: 17px; font-weight: 700; margin: 0;">${booking.date} at ${booking.timeSlot}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; width: 140px; font-weight: 500;">Client Name</td>
        <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Email</td>
        <td style="padding: 10px 0; color: #60a5fa;"><a href="mailto:${booking.email}" style="color: #60a5fa; text-decoration: none;">${booking.email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Phone</td>
        <td style="padding: 10px 0; color: #ffffff;"><a href="tel:${booking.phone}" style="color: #ffffff; text-decoration: none;">${booking.phone}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Locale</td>
        <td style="padding: 10px 0; color: #ffffff; text-transform: uppercase;">${booking.locale}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #9ca3af; font-weight: 500;">Booked At</td>
        <td style="padding: 10px 0; color: #9ca3af; font-size: 12px;">${new Date(booking.submittedAt).toUTCString()}</td>
      </tr>
    </table>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937;">
      <a href="mailto:${booking.email}?subject=${encodeURIComponent(`SpeciaLevel Consultation: ${booking.date} at ${booking.timeSlot}`)}" style="display: inline-block; background-color: #10b981; color: #ffffff; font-weight: 600; font-size: 13px; padding: 10px 18px; border-radius: 6px; text-decoration: none;">Email ${booking.firstName}</a>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
New Consultation Booked - SpeciaLevel

Client: ${fullName}
Email: ${booking.email}
Phone: ${booking.phone}
Date: ${booking.date}
Time: ${booking.timeSlot}
Locale: ${booking.locale}
Booked At: ${booking.submittedAt}
  `.trim();

  return sendBrevoEmail({
    to: [{ email: adminEmail, name: "SpeciaLevel Admin" }],
    replyTo: { email: booking.email, name: fullName },
    subject: `New Call Booked: ${fullName} - ${booking.date} at ${booking.timeSlot}`,
    htmlContent: html,
    textContent: text,
  });
}

/** 4. Confirmation email to the person who booked the call */
export async function sendBookingConfirmationToUser(booking: BookingPayload) {
  const isAr = booking.locale === "ar";
  const fullName = `${booking.firstName} ${booking.lastName}`.trim();

  const subject = isAr
    ? `تأكيد موعد استشارتك: ${booking.date} في ${booking.timeSlot} — SpeciaLevel`
    : `Consultation Confirmed: ${booking.date} at ${booking.timeSlot} — SpeciaLevel`;

  const html = isAr
    ? `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e5e7eb; padding: 24px; margin: 0; text-align: right;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <h1 style="color: #10b981; font-size: 22px; margin: 0 0 12px 0; font-weight: 700;">SpeciaLevel</h1>
    <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">أهلاً ${booking.firstName}،</h2>
    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0;">
      تم تأكيد موعد استشارتك مع SpeciaLevel بنجاح! يسعدنا التحدث معك لمناقشة أهدافك واحتياجات مشروعك.
    </p>

    <div style="background-color: #1a2234; border: 1px solid #2d3748; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #10b981; font-size: 15px; margin: 0 0 12px 0; font-weight: 700;">تفاصيل الموعد:</h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff;">📅 <strong>التاريخ:</strong> ${booking.date}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff;">🕒 <strong>الوقت:</strong> ${booking.timeSlot}</p>
      <p style="margin: 0; font-size: 14px; color: #9ca3af;">📞 <strong>رقم الهاتف:</strong> ${booking.phone}</p>
    </div>

    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
      سيتواصل معك أحد أعضاء فريقنا في الموعد المحدّد. إذا كنت بحاجة إلى تعديل الموعد أو إضافة أي ملاحظات، يمكنك ببساطة الرد على هذا البريد الإلكتروني.
    </p>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; color: #6b7280; font-size: 12px;">
      فريق SpeciaLevel · <a href="https://specialevel.com" style="color: #10b981; text-decoration: none;">specialevel.com</a>
    </div>
  </div>
</body>
</html>
    `.trim()
    : `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e5e7eb; padding: 24px; margin: 0;">
  <div style="max-width: 580px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <h1 style="color: #10b981; font-size: 22px; margin: 0 0 12px 0; font-weight: 700;">SpeciaLevel</h1>
    <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">Hi ${booking.firstName},</h2>
    <p style="color: #d1d5db; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0;">
      Your consultation with SpeciaLevel is confirmed! We look forward to speaking with you and discussing how we can help elevate your operations.
    </p>

    <div style="background-color: #1a2234; border: 1px solid #2d3748; border-radius: 8px; padding: 20px; margin: 20px 0;">
      <h3 style="color: #10b981; font-size: 15px; margin: 0 0 12px 0; font-weight: 700;">Consultation Details:</h3>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff;">📅 <strong>Date:</strong> ${booking.date}</p>
      <p style="margin: 0 0 8px 0; font-size: 14px; color: #ffffff;">🕒 <strong>Time:</strong> ${booking.timeSlot}</p>
      <p style="margin: 0; font-size: 14px; color: #9ca3af;">📞 <strong>Phone:</strong> ${booking.phone}</p>
    </div>

    <p style="color: #9ca3af; font-size: 13px; line-height: 1.6; margin: 20px 0 0 0;">
      A member of our team will connect with you at the scheduled time. If you need to reschedule or have questions beforehand, simply reply directly to this email.
    </p>

    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f2937; color: #6b7280; font-size: 12px;">
      The SpeciaLevel Team · <a href="https://specialevel.com" style="color: #10b981; text-decoration: none;">specialevel.com</a>
    </div>
  </div>
</body>
</html>
    `.trim();

  const text = isAr
    ? `أهلاً ${booking.firstName}، تم تأكيد موعد استشارتك مع SpeciaLevel بتاريخ ${booking.date} في ${booking.timeSlot}. سيتواصل معك فريقنا في الموعد المحدد.`
    : `Hi ${booking.firstName},\n\nYour consultation with SpeciaLevel is confirmed for ${booking.date} at ${booking.timeSlot}.\n\nOur team will connect with you at the scheduled time. If you need to reschedule, simply reply to this email.\n\nBest regards,\nThe SpeciaLevel Team`;

  return sendBrevoEmail({
    to: [{ email: booking.email, name: fullName }],
    subject,
    htmlContent: html,
    textContent: text,
  });
}

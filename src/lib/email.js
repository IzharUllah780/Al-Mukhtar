import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "dummy_resend_key";
const resend = new Resend(resendApiKey);
const FROM = process.env.RESEND_FROM || "Al-Mukhtar Institute <info@almukhtar.org.pk>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || "https://almukhtar.org.pk";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "izhar5ullah@gmail.com";

/**
 * Base email layout — Simple, clean, standard corporate/academic email format.
 * No floating cards, no heavy borders, no nested box containers.
 * Renders naturally and cleanly across Gmail, Outlook, Apple Mail, and mobile clients.
 */
function renderBaseTemplate({ title, preheader = "", contentHtml }) {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 24px 16px; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b;">
  ${preheader ? `<div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${preheader}</div>` : ""}
  
  <div style="max-width: 580px; margin: 0 auto;">
    <!-- Simple Institutional Header -->
    <div style="padding-bottom: 14px; border-bottom: 2px solid #0d9488; margin-bottom: 24px;">
      <div style="font-size: 17px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">
        Al-Mukhtar Institute
      </div>
      <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
        Institute of Islamic Sciences & Education
      </div>
    </div>

    <!-- Email Content Body -->
    <div style="color: #1e293b; font-size: 15px; line-height: 1.65;">
      ${contentHtml}
    </div>

    <!-- Simple Standard Footer -->
    <div style="border-top: 1px solid #e2e8f0; margin-top: 36px; padding-top: 16px; font-size: 12px; color: #64748b; line-height: 1.5;">
      <p style="margin: 0 0 6px 0;">
        Al-Mukhtar Institute &bull; Peshawar, KPK, Pakistan
      </p>
      <p style="margin: 0 0 6px 0;">
        Need assistance? Contact us at <a href="mailto:${ADMIN_EMAIL}" style="color: #0d9488; text-decoration: none; font-weight: 600;">${ADMIN_EMAIL}</a> or visit <a href="${SITE_URL}" style="color: #0d9488; text-decoration: none;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
      </p>
      <p style="margin: 0; font-size: 11px; color: #94a3b8;">
        &copy; ${currentYear} Al-Mukhtar Institute. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send OTP verification or password reset email.
 * Simple, standard text format without box cards.
 */
export async function sendOtpEmail(to, otp, type = "verify", username = "") {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email Mock] RESEND_API_KEY not configured. Mocking OTP email to:", to, "OTP:", otp);
    return { success: true, mocked: true };
  }

  const isReset = type === "reset";
  const subject = isReset
    ? "Reset Your Al-Mukhtar Account Password"
    : "Verify Your Al-Mukhtar Account Email";

  const title = isReset ? "Password Reset Code" : "Email Verification Code";
  const preheader = isReset
    ? `Your password reset code is ${otp}. Valid for 10 minutes.`
    : `Your verification code is ${otp}. Complete your registration.`;

  const headingText = isReset ? "Reset Your Password" : "Verify Your Email Address";
  const leadText = isReset
    ? `Hello${username ? ` ${username}` : ""}, we received a request to reset the password for your Al-Mukhtar account.`
    : `Hello${username ? ` ${username}` : ""}, thank you for registering with Al-Mukhtar Institute.`;

  const contentHtml = `
    <h2 style="margin: 0 0 14px 0; font-size: 19px; font-weight: 700; color: #0f172a;">
      ${headingText}
    </h2>
    
    <p style="margin: 0 0 16px 0; font-size: 15px; color: #334155;">
      ${leadText}
    </p>

    <p style="margin: 0 0 8px 0; font-size: 15px; color: #334155;">
      Your verification code is:
    </p>

    <div style="margin: 14px 0 20px 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0d9488;">
      ${otp}
    </div>

    <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">
      ⏱ This code will expire in <strong>10 minutes</strong>.
    </p>

    <p style="margin: 0 0 10px 0; font-size: 13px; color: #64748b;">
      <strong>Security notice:</strong> Do not share this code with anyone. Al-Mukhtar staff will never ask you for your verification code.
    </p>
    
    <p style="margin: 0; font-size: 13px; color: #94a3b8;">
      If you did not initiate this request, you can safely ignore this email. Your account remains secure.
    </p>
  `;

  const html = renderBaseTemplate({ title, preheader, contentHtml });

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (result?.error) {
      console.error("[Resend API Error]:", result.error);
    }
    return result;
  } catch (error) {
    console.error("[Email Exception] Failed to send OTP email:", error);
    throw error;
  }
}

/**
 * Send Course Application Confirmation email to the student/applicant.
 * Simple, professional academic letter layout (no nested boxes/cards).
 */
export async function sendApplicationConfirmationEmail({
  to,
  applicantName,
  courseName,
  shift,
  qualification,
  whatsapp,
  applicationId,
}) {
  if (!to) return;

  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email Mock] RESEND_API_KEY not configured. Mocking application confirmation email to:", to);
    return { success: true, mocked: true };
  }

  const subject = `Admission Application Received — ${courseName} | Al-Mukhtar`;
  const preheader = `We received your application for ${courseName}. Our admissions team will review it shortly.`;
  const formattedShift = shift ? shift.charAt(0).toUpperCase() + shift.slice(1) : "Morning";

  const contentHtml = `
    <h2 style="margin: 0 0 14px 0; font-size: 19px; font-weight: 700; color: #0f172a;">
      Admission Application Received
    </h2>

    <p style="margin: 0 0 14px 0; font-size: 15px; color: #334155;">
      Dear <strong>${applicantName || "Applicant"}</strong>,
    </p>

    <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155;">
      Thank you for applying to Al-Mukhtar Institute. We have successfully received your admission application for <strong>${courseName}</strong>.
    </p>

    <div style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 14px 0; margin: 20px 0;">
      <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 10px;">
        Application Summary
      </div>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="width: 140px; color: #64748b; padding: 3px 0;"><strong>Program:</strong></td>
          <td style="color: #0f172a; font-weight: 600; padding: 3px 0;">${courseName}</td>
        </tr>
        <tr>
          <td style="color: #64748b; padding: 3px 0;"><strong>Shift:</strong></td>
          <td style="color: #0f172a; padding: 3px 0;">${formattedShift}</td>
        </tr>
        ${qualification ? `
        <tr>
          <td style="color: #64748b; padding: 3px 0;"><strong>Qualification:</strong></td>
          <td style="color: #0f172a; padding: 3px 0;">${qualification}</td>
        </tr>` : ""}
        ${whatsapp ? `
        <tr>
          <td style="color: #64748b; padding: 3px 0;"><strong>WhatsApp:</strong></td>
          <td style="color: #0f172a; padding: 3px 0;">${whatsapp}</td>
        </tr>` : ""}
        ${applicationId ? `
        <tr>
          <td style="color: #64748b; padding: 3px 0;"><strong>Reference ID:</strong></td>
          <td style="font-family: monospace; color: #0d9488; font-weight: 600; padding: 3px 0;">#${applicationId.slice(-8).toUpperCase()}</td>
        </tr>` : ""}
      </table>
    </div>

    <h3 style="margin: 20px 0 10px 0; font-size: 15px; font-weight: 700; color: #0f172a;">
      Next Steps:
    </h3>
    <ol style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.7;">
      <li style="margin-bottom: 6px;">
        <strong>Application Review:</strong> The admissions committee will verify your submitted details.
      </li>
      <li style="margin-bottom: 6px;">
        <strong>Admissions Contact:</strong> An admissions coordinator will reach out via WhatsApp or phone call within <strong>1–2 working days</strong>.
      </li>
      <li>
        <strong>Enrollment & Orientation:</strong> You will receive your class schedule and orientation details upon confirmation.
      </li>
    </ol>

    <p style="margin: 24px 0 0 0; font-size: 14px; color: #475569;">
      Warm regards,<br />
      <strong>Office of Admissions</strong><br />
      <span style="font-size: 13px; color: #64748b;">Al-Mukhtar Institute of Islamic Sciences</span>
    </p>
  `;

  const html = renderBaseTemplate({
    title: `Admission Application — ${courseName}`,
    preheader,
    contentHtml,
  });

  try {
    const result = await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });

    if (result?.error) {
      console.error("[Resend API Error]:", result.error);
    }
    return result;
  } catch (error) {
    console.error("[Email Exception] Failed to send application confirmation email:", error);
    throw error;
  }
}

/**
 * Send contact form submission to ADMIN_EMAIL via Resend.
 * Clean, simple, professional email layout.
 */
export async function sendContactFormEmail({ name, email, phone, subject, message }) {
  const adminEmail = process.env.ADMIN_EMAIL || "izhar5ullah@gmail.com";
  const emailSubject = `[Inquiry] ${subject || "New Message from Website"} - ${name}`;

  const sanitizedName = (name || "Visitor").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sanitizedEmail = (email || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sanitizedPhone = (phone || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sanitizedSubject = (subject || "General Inquiry").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const sanitizedMessage = (message || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const dateString = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const contentHtml = `
    <h2 style="margin: 0 0 4px 0; font-size: 18px; color: #0f172a; font-weight: 700;">
      New Website Inquiry
    </h2>
    <p style="margin: 0 0 18px 0; font-size: 13px; color: #64748b;">
      Received on ${dateString}
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; font-size: 14px; line-height: 1.8;">
      <tr>
        <td style="width: 140px; color: #64748b; vertical-align: top; padding: 3px 0;"><strong>Sender:</strong></td>
        <td style="color: #0f172a; font-weight: 600; padding: 3px 0;">${sanitizedName}</td>
      </tr>
      <tr>
        <td style="color: #64748b; vertical-align: top; padding: 3px 0;"><strong>Email:</strong></td>
        <td style="color: #0d9488; padding: 3px 0;"><a href="mailto:${sanitizedEmail}" style="color: #0d9488; text-decoration: none; font-weight: 600;">${sanitizedEmail}</a></td>
      </tr>
      <tr>
        <td style="color: #64748b; vertical-align: top; padding: 3px 0;"><strong>Phone / WhatsApp:</strong></td>
        <td style="color: #0f172a; padding: 3px 0;">${sanitizedPhone || "Not provided"}</td>
      </tr>
      <tr>
        <td style="color: #64748b; vertical-align: top; padding: 3px 0;"><strong>Subject:</strong></td>
        <td style="color: #0f172a; font-weight: 600; padding: 3px 0;">${sanitizedSubject}</td>
      </tr>
    </table>

    <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-bottom: 20px;">
      <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 10px;">
        Message Content
      </div>
      <div style="font-size: 15px; color: #0f172a; line-height: 1.7; white-space: pre-wrap;">
${sanitizedMessage}
      </div>
    </div>

    <p style="margin: 0; font-size: 13px; color: #64748b;">
      You can reply directly to this email to respond to ${sanitizedName} (<a href="mailto:${sanitizedEmail}" style="color: #0d9488; text-decoration: none;">${sanitizedEmail}</a>).
    </p>
  `;

  const html = renderBaseTemplate({
    title: emailSubject,
    preheader: `New inquiry from ${sanitizedName}`,
    contentHtml,
  });

  try {
    return await resend.emails.send({
      from: FROM,
      to: adminEmail,
      subject: emailSubject,
      replyTo: email,
      html,
    });
  } catch (error) {
    console.error("[Email Error] Failed to send contact form email:", error);
    throw error;
  }
}

/**
 * Send a broadcast email to multiple users (admin feature).
 */
export async function sendBulkEmail(emails, subject, message) {
  if (!process.env.RESEND_API_KEY || !Array.isArray(emails) || emails.length === 0) return;
  const CHUNK = 50;

  const contentHtml = `
    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      ${subject}
    </h2>
    
    <div style="font-size: 15px; color: #334155; line-height: 1.7; white-space: pre-wrap;">
${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </div>
  `;

  const html = renderBaseTemplate({
    title: subject,
    preheader: subject,
    contentHtml,
  });

  const promises = [];
  for (let i = 0; i < emails.length; i += CHUNK) {
    const chunk = emails.slice(i, i + CHUNK);
    promises.push(
      resend.emails.send({
        from: FROM,
        to: chunk,
        subject,
        html,
      })
    );
  }

  await Promise.all(promises);
}

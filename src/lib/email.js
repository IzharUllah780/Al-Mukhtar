import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "dummy_resend_key";
const resend = new Resend(resendApiKey);
const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.BASE_URL || "https://almukhtar.edu.pk";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "izhar5ullah@gmail.com";

/**
 * Base email layout with clean, open, modern editorial typography.
 * No heavy boxed borders or clunky outdated email designs.
 */
function renderBaseTemplate({ title, preheader = "", contentHtml }) {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
  <style>
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; padding: 24px 16px !important; }
      .content-cell { padding: 24px 16px !important; }
      .otp-code { font-size: 32px !important; letter-spacing: 8px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fafbfb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b; line-height: 1.6;">
  ${preheader ? `<div style="display: none; font-size: 1px; color: #fafbfb; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">${preheader}</div>` : ""}
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fafbfb; width: 100%; margin: 0; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Wrapper (Open & Clean) -->
        <table role="presentation" class="email-container" width="560" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);">
          
          <!-- Top Header / Brand Mark -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #f1f5f9; background: #ffffff;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="display: inline-block;">
                      <span style="font-size: 15px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: #0f172a;">AL-MUKHTAR</span>
                      <span style="display: inline-block; width: 6px; height: 6px; background-color: #0d9488; border-radius: 50%; margin-left: 4px; vertical-align: middle;"></span>
                    </div>
                    <p style="margin: 2px 0 0 0; font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 0.5px; text-transform: uppercase;">Institute of Islamic Sciences & Education</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
          <tr>
            <td class="content-cell" style="padding: 36px 36px 32px 36px; background-color: #ffffff;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Sleek Minimalist Footer -->
          <tr>
            <td style="padding: 24px 36px 32px 36px; background-color: #f8fafc; border-top: 1px solid #f1f5f9;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: left; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                    <p style="margin: 0 0 6px 0; color: #64748b; font-weight: 500;">
                      Al-Mukhtar Institute &bull; Academic Portal
                    </p>
                    <p style="margin: 0;">
                      Need help? Reply directly to this email or contact support at <a href="mailto:${ADMIN_EMAIL}" style="color: #0d9488; text-decoration: none; font-weight: 600;">${ADMIN_EMAIL}</a>
                    </p>
                    <p style="margin: 12px 0 0 0; font-size: 11px; color: #94a3b8;">
                      &copy; ${currentYear} Al-Mukhtar Institute. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Send OTP verification or password reset email.
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @param {"verify"|"reset"} type - Purpose of the OTP
 * @param {string} [username] - Optional recipient name/username
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
    ? `Hello${username ? ` ${username}` : ""}, we received a request to reset your password for your Al-Mukhtar account. Enter the verification code below to proceed:`
    : `Hello${username ? ` ${username}` : ""}, thank you for registering with Al-Mukhtar Institute. Please use the verification code below to verify your email address:`;

  const contentHtml = `
    <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; line-height: 1.3;">
      ${headingText}
    </h1>
    
    <p style="margin: 0 0 28px 0; font-size: 15px; color: #475569; line-height: 1.6;">
      ${leadText}
    </p>

    <!-- Clean, Open OTP Display (No heavy boxes) -->
    <div style="margin: 0 0 28px 0; padding: 24px 20px; background-color: #f0fdfa; border-radius: 12px; border: 1px solid #ccfbf1; text-align: center;">
      <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #0d9488; margin-bottom: 8px;">
        One-Time Verification Code
      </div>
      <div class="otp-code" style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #0f766e; line-height: 1.2; padding-left: 10px;">
        ${otp}
      </div>
      <div style="font-size: 12px; color: #64748b; margin-top: 10px; font-weight: 500;">
        ⏱ Expires in <strong>10 minutes</strong>
      </div>
    </div>

    <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.5;">
      <strong>Security notice:</strong> Never share this code with anyone. Al-Mukhtar staff will never ask you for your OTP.
    </p>
    
    <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
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
    <div style="display: inline-block; padding: 4px 12px; background-color: #ecfdf5; border-radius: 9999px; border: 1px solid #a7f3d0; margin-bottom: 16px;">
      <span style="font-size: 12px; font-weight: 700; color: #047857;">Application Received</span>
    </div>

    <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; line-height: 1.3;">
      Dear ${applicantName || "Applicant"},
    </h1>

    <p style="margin: 0 0 24px 0; font-size: 15px; color: #475569; line-height: 1.6;">
      Thank you for your interest in <strong>Al-Mukhtar Institute</strong>. We have successfully received your admission application for <strong>${courseName}</strong>.
    </p>

    <!-- Application Summary Details -->
    <div style="margin: 0 0 28px 0; padding: 20px 24px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
        Application Overview
      </div>
      
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: 14px; line-height: 1.8;">
        <tr>
          <td style="color: #64748b; width: 38%; padding: 4px 0;">Selected Course:</td>
          <td style="color: #0f172a; font-weight: 700; padding: 4px 0;">${courseName}</td>
        </tr>
        <tr>
          <td style="color: #64748b; padding: 4px 0;">Shift Preference:</td>
          <td style="color: #0f172a; font-weight: 600; padding: 4px 0;">${formattedShift}</td>
        </tr>
        ${qualification ? `
        <tr>
          <td style="color: #64748b; padding: 4px 0;">Qualification:</td>
          <td style="color: #0f172a; padding: 4px 0;">${qualification}</td>
        </tr>` : ""}
        ${whatsapp ? `
        <tr>
          <td style="color: #64748b; padding: 4px 0;">Contact WhatsApp:</td>
          <td style="color: #0f172a; padding: 4px 0;">${whatsapp}</td>
        </tr>` : ""}
        ${applicationId ? `
        <tr>
          <td style="color: #64748b; padding: 4px 0;">Reference ID:</td>
          <td style="font-family: monospace; color: #0d9488; font-weight: 600; padding: 4px 0;">#${applicationId.slice(-8).toUpperCase()}</td>
        </tr>` : ""}
      </table>
    </div>

    <!-- Next Steps Timeline / Guidance -->
    <h2 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #0f172a;">
      What Happens Next?
    </h2>
    <ol style="margin: 0 0 28px 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.7;">
      <li style="margin-bottom: 8px;">
        <strong>Application Review:</strong> Our academic committee is reviewing your submitted details and prerequisites.
      </li>
      <li style="margin-bottom: 8px;">
        <strong>Verification & Interview:</strong> An admissions coordinator will contact you via WhatsApp or phone call within <strong>1–2 business days</strong>.
      </li>
      <li>
        <strong>Enrollment & Class Schedule:</strong> Upon verification, you will receive your student enrollment package and timetable.
      </li>
    </ol>

    <div style="padding-top: 16px; border-top: 1px solid #f1f5f9;">
      <p style="margin: 0; font-size: 14px; color: #475569;">
        Warm regards,<br />
        <strong>Office of Admissions</strong><br />
        <span style="font-size: 13px; color: #64748b;">Al-Mukhtar Institute of Islamic Sciences</span>
      </p>
    </div>
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
 */
export async function sendContactFormEmail({ name, email, phone, subject, message }) {
  const adminEmail = process.env.ADMIN_EMAIL || "izhar5ullah@gmail.com";
  const emailSubject = `[Inquiry] ${subject || "New Message from Website"}`;

  const contentHtml = `
    <div style="display: inline-block; padding: 4px 12px; background-color: #f1f5f9; border-radius: 9999px; margin-bottom: 16px;">
      <span style="font-size: 12px; font-weight: 700; color: #475569;">Website Contact Form</span>
    </div>

    <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">
      New Inquiry from ${name}
    </h1>

    <div style="margin: 0 0 24px 0; padding: 18px 20px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.8;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="color: #64748b; width: 30%; padding: 4px 0;">Sender:</td>
          <td style="color: #0f172a; font-weight: 600; padding: 4px 0;">${name}</td>
        </tr>
        <tr>
          <td style="color: #64748b; padding: 4px 0;">Email:</td>
          <td style="color: #0d9488; font-weight: 600; padding: 4px 0;"><a href="mailto:${email}" style="color: #0d9488; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="color: #64748b; padding: 4px 0;">Phone:</td>
          <td style="color: #0f172a; padding: 4px 0;">${phone || "Not provided"}</td>
        </tr>
        <tr>
          <td style="color: #64748b; padding: 4px 0;">Subject:</td>
          <td style="color: #0f172a; font-weight: 600; padding: 4px 0;">${subject}</td>
        </tr>
      </table>
    </div>

    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">
      Message Content:
    </div>
    
    <div style="padding: 16px 20px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #1e293b; line-height: 1.7; white-space: pre-wrap;">
      ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
    </div>
  `;

  const html = renderBaseTemplate({
    title: emailSubject,
    preheader: `New message from ${name}: ${subject}`,
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
    <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; line-height: 1.3;">
      ${subject}
    </h1>
    
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

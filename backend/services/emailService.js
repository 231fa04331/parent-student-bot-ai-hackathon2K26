const RESEND_API_URL = "https://api.resend.com/emails";

const isPresent = (value) => Boolean(String(value || "").trim());

const sendWithResend = async (email, otp) => {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const from = String(process.env.RESEND_FROM_EMAIL || process.env.SMTP_FROM || "").trim();
  const timeoutMs = Number(process.env.RESEND_TIMEOUT_MS || 10000);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Student Login OTP",
        html: `<h2>Your OTP is ${otp}</h2>`,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error (${response.status}): ${errorBody}`);
    }
  } finally {
    clearTimeout(timeoutId);
  }
};

const sendWithSmtp = async (email, otp) => {
  const transporter = require("../utils/mailer");
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Student Login OTP",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};

const sendOTP = async (email, otp) => {
  if (isPresent(process.env.RESEND_API_KEY)) {
    console.log("OTP email provider: resend");
    await sendWithResend(email, otp);
    return;
  }

  console.log("OTP email provider: smtp");
  await sendWithSmtp(email, otp);
};

module.exports = sendOTP;
import nodemailer from "nodemailer";
import type { Request, Response } from "express"; // Only if you're using Express. Otherwise, use req: any, res: any.

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Handler signature below uses Express types. 
export default async function handler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { toEmail, slip } = req.body;

  if (!toEmail || !slip) {
    res.status(400).json({ error: "Missing parameters" });
    return;
  }

  try {
    const mailHtml = `
      <h2>Salary Slip</h2>
      <p><b>Name:</b> ${slip.staff_name}</p>
      <p><b>Role:</b> ${slip.role}</p>
      <p><b>Payment Month:</b> ${slip.payment_month || ""}</p>
      <p><b>Payment Date:</b> ${new Date(slip.payment_date).toLocaleDateString()}</p>
      <p><b>Salary Paid:</b> ₹${slip.salary_paid}</p>
      <p><b>Bonus:</b> ${slip.bonus_percent ?? "—"}% (₹${slip.bonus_amount ?? 0})</p>
      <p><b>Total Paid:</b> ₹${slip.total_amount}</p>
      <p><b>Payment Mode:</b> ${slip.payment_mode || "-"}</p>
    `;

    await transporter.sendMail({
      from: `"Ashwani Diagnostic Center" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: "Your Salary Slip",
      html: mailHtml,
    });

    res.status(200).json({ success: true, message: "Email sent" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}

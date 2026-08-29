import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  const info = await transporter.sendMail({
    from: `"AI Placement Platform" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent:", info.messageId);

  return info;
};
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  const { data, error } = await resend.emails.send({
    from: "AI Placement Platform <onboarding@resend.dev>",
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent:", data?.id);

  return data;
};
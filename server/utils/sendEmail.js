import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(
  __dirname,
  "..",
  "templates",
  "email-template.html",
);

const rawTemplate = fs.readFileSync(templatePath, "utf-8");

function renderTemplate(template, data) {
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    const value = data[key] ?? "";

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  });
}


export const sendContactEmail = async ({ name, email, message }) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const html = renderTemplate(rawTemplate, {
    name,
    email,
    message,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  });

  const { data, error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: [process.env.EMAIL],
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    html,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error(error.message || "Email sending failed");
  }

  console.log("Email sent:", data?.id);
};

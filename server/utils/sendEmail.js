import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendContactEmail = async ({ name, email, message }) => {
  const html = renderTemplate(rawTemplate, {
    name,
    email,
    message,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  });

  await getTransporter().sendMail({
    from: `"${name} (via Portfolio)" <${process.env.SMTP_USER}>`,
    to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    html,
  });
};

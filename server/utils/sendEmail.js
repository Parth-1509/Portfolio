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
  "email-template.html"
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

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const html = renderTemplate(rawTemplate, {
    name,
    email,
    message,
    timestamp: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    replyTo: email,
    subject: `New portfolio message from ${name}`,
    html,
  });
};
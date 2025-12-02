import { resendCLient, sender } from "../lib/resend";
import { createWelcomeEmailTemplate } from "./template";

export const sendWelcomeEmail = async (
  email: string,
  name: string,
  clientURL: string
) => {
  const { data, error } = await resendCLient.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Messaging App.",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    throw error;
  }
  console.log("Email sent.", data);
};

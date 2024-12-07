import "server-only";

import { ReactNode } from "react";

import emailConfig from "@/configs/email-config";

//import { Resend } from "resend";

// const resend = new Resend(env.RESEND_API_KEY);

const resend = {
  emails: {
    send: async ({}: any) => {
      return { error: null } as any;
    },
  },
};

export async function sendEmail(
  email: string,
  subject: string,
  body: ReactNode
) {
  const { error } = await resend.emails.send({
    from: emailConfig.mailFrom,
    to: email,
    subject,
    react: body,
  });

  if (error) {
    console.log("email error: ", error.message);
    throw error;
  }
}

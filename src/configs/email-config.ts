import "server-only";

import { env } from "@/env";

export default {
  supportMailAddress: env.SUPPORT_MAIL_ADDRESS,
  mailFrom: env.MAIL_FROM_ADDRESS,
  mailFromName: env.NEXT_PUBLIC_APP_NAME,
  resendApiKey: env.RESEND_API_KEY,
};

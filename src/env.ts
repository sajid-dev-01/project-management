import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    ENCRYPTION_KEY: z.string(),
    // db
    DATABASE_URL: z.string().url(),
    DB_AUTH_TOKEN: z.string(),
    // auth
    EMAIL_CONFIRMATION_EXPIRES: z.coerce.number(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    // email
    SUPPORT_MAIL_ADDRESS: z.string().optional(),
    MAIL_FROM_ADDRESS: z.string().optional(),
    MAIL_FROM_NAME: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string(),
    NEXT_PUBLIC_COMPANY_NAME: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME,
    // server
    NODE_ENV: process.env.NODE_ENV,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    EMAIL_CONFIRMATION_EXPIRES: process.env.EMAIL_CONFIRMATION_EXPIRES,
    DATABASE_URL: process.env.DATABASE_URL,
    DB_AUTH_TOKEN: process.env.DB_AUTH_TOKEN,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SUPPORT_MAIL_ADDRESS: process.env.SUPPORT_MAIL_ADDRESS,
    MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
});

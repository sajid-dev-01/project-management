import "server-only";

import { env } from "@/env";

const currentYear = new Date().getFullYear().toString();
const websiteLaunchYear = "2024";

export default {
  name: env.NEXT_PUBLIC_APP_NAME,
  url: env.NEXT_PUBLIC_APP_URL,
  env: env.NODE_ENV,
  locale: "en-US",
  language: "en-us",
  source: {
    github: "https://github.com/sajid-dev-01/next-drizzle-starter.git",
  },
  companyName: env.NEXT_PUBLIC_COMPANY_NAME,
  companyAddr: "123 Main St, Anytown, ST 12345",
  copywriteYears:
    currentYear === websiteLaunchYear
      ? currentYear
      : `${websiteLaunchYear}-${currentYear}`,
  author: {
    github: "https://github.com/sajid-dev-01",
    twitter: "@sajidctg1",
  },
};

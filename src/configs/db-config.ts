import "server-only";

import { env } from "@/env";

export default {
  driver: "turso",
  turso: {
    url: env.DATABASE_URL,
    token: env.DB_AUTH_TOKEN,
  },
};

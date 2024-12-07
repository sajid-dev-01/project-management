import { hc } from "hono/client";

import { env } from "@/env";
import { AppType } from "@/server";

export const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);

import "server-only";

import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

import { SESSION_COOKIE } from "@/features/auth/constants";
import { validateSessionToken } from "@/services/auth-service";
import { Session, User } from "@/types";

type AdditionalContext = {
  Variables: {
    user: User;
    session: Session;
  };
};

export const sessionMiddleware = createMiddleware<AdditionalContext>(
  async (c, next) => {
    const token = getCookie(c, SESSION_COOKIE);
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const auth = await validateSessionToken(token);
    if (!auth) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", auth.user);
    c.set("session", auth.session);

    await next();
  }
);

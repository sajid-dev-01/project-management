import "server-only";

import { cookies } from "next/headers";

import appConfig from "@/configs/app-config";

import { SESSION_COOKIE } from "../constants";

export async function setSessionTokenCookie(token: string, expiresAt: Date) {
  const cookie = await cookies();

  cookie.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: appConfig.env === "production",
    expires: expiresAt,
    path: "/",
  });
}

export async function deleteSessionTokenCookie() {
  const cookie = await cookies();

  cookie.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: appConfig.env === "production",
    maxAge: 0,
    path: "/",
  });
}

export async function getSessionToken() {
  const cookie = await cookies();
  return cookie.get(SESSION_COOKIE)?.value;
}

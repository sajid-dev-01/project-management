import "server-only";

import { Google } from "arctic";
import { cache } from "react";

import authConfig from "@/configs/auth-config";
import { validateSessionToken } from "@/services/auth-service";

import { getSessionToken } from "./session";

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export const googleAuth = new Google(
  authConfig.google.clientId,
  authConfig.google.secret,
  authConfig.google.redirectUri
);

export const authenticate = cache(async () => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) return undefined;

  const res = await validateSessionToken(sessionToken);

  if (!res?.session) return undefined;

  return res;
});

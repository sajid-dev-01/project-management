import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";

import appConfig from "@/configs/app-config";
import { googleAuth } from "@/features/auth/lib/auth";

export async function GET(): Promise<Response> {
  const cookie = await cookies();
  //if (!globalGETRateLimit()) {
  //  return new Response("Too many requests", {
  //    status: 429
  //  });
  //}

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = googleAuth.createAuthorizationURL(state, codeVerifier, [
    "openid",
    "profile",
    "email",
  ]);

  cookie.set("google_oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: appConfig.env === "production",
    maxAge: 60 * 10, // 10 minutes
  });
  cookie.set("google_code_verifier", codeVerifier, {
    path: "/",
    httpOnly: true,
    secure: appConfig.env === "production",
    maxAge: 60 * 10, // 10 minutes
  });

  return new Response(null, {
    status: 302,
    headers: {
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      //'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      Location: url.toString(),
    },
  });
}

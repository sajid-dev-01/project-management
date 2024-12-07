import { ObjectParser } from "@pilcrowjs/object-parser";
import { decodeIdToken, OAuth2Tokens } from "arctic";
import { cookies } from "next/headers";
import { userAgent } from "next/server";

import { googleAuth } from "@/features/auth/lib/auth";
import { createSession } from "@/services/auth-service";
import {
  createGoogleUser,
  getAccountByGoogleId,
} from "@/services/user-service";

export async function GET(request: Request): Promise<Response> {
  const cookie = await cookies();
  //if (!globalGETRateLimit()) {
  //  return new Response("Too many requests", {
  //    status: 429
  //  });
  //}
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookie.get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookie.get("google_code_verifier")?.value ?? null;

  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await googleAuth.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);
  const googleId = claimsParser.getString("sub");
  const existingAccount = await getAccountByGoogleId(googleId);

  if (existingAccount) {
    await createSession(existingAccount.userId, {
      ipAddress: request.headers.get("X-Forwarded-For"),
      userAgent: userAgent({ headers: request.headers }),
    });

    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }

  const name = claimsParser.getString("name");
  const picture = claimsParser.getString("picture");
  const email = claimsParser.getString("email");
  const user = await createGoogleUser({ email, name, picture, sub: googleId });

  await createSession(user.id, {
    ipAddress: request.headers.get("X-Forwarded-For"),
    userAgent: userAgent({ headers: request.headers }),
  });

  return new Response(null, {
    status: 302,
    headers: {
      //'Access-Control-Allow-Origin': '*',
      //'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      //'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      Location: "/",
    },
  });
}

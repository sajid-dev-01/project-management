import "server-only";

import { sha256 } from "@oslojs/crypto/sha2";
import {
  decodeBase64,
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { verifyHOTP } from "@oslojs/otp";
import bcrypt from "bcryptjs";

import {
  isVerifyEmailSent,
  sendVerifyEmail,
} from "@/features/auth/lib/send-verify-email";
import {
  deleteSessionTokenCookie,
  setSessionTokenCookie,
} from "@/features/auth/lib/session";
import { SignInDto, SignUpDto } from "@/features/auth/schemas";
import { decrypt } from "@/lib/encryption";
import {
  ApplicationError,
  NotFoundError,
  TokenError,
  ValidationError,
} from "@/lib/errors";
import {
  deleteSession,
  deleteSessionByUserId,
  findSessionById,
  insertSession,
  updateSession,
} from "@/repositories/sessions";
import {
  deleteUser,
  findUser,
  findUserByEmail,
  insertUser,
  updateUserByEmail,
} from "@/repositories/users";
import {
  deleteVerifyToken,
  getVerifyTokenByEmail,
} from "@/repositories/verifications";
import { TableID } from "@/types";

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15; // 15 days
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2;

export async function validateCredential(dto: SignInDto) {
  const { email, password } = dto;

  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    throw new ValidationError({ email: ["Email does not exist!"] });
  }

  if (!user.emailVerified) {
    if (await isVerifyEmailSent(email)) {
      throw new ApplicationError("Email already sent. Try after a few minutes");
    }
    await sendVerifyEmail(email);

    return { success: true, message: "Confirmation email sent!" } as const;
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new ApplicationError("Invalid credentials!");
  }

  return user;
}

export async function signUpUser({ name, email, password }: SignUpDto) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    if (existingUser.emailVerified) {
      throw new ValidationError({ email: ["Email is already taken"] });
    }

    await deleteUser(existingUser.id);
  }

  const user = await insertUser({ email, name, password });

  if (!(await isVerifyEmailSent(email))) {
    await sendVerifyEmail(email);
  }

  return user;
}

export async function resendVerifyEmail(email: string) {
  if (await isVerifyEmailSent(email)) {
    throw new ApplicationError("Email already sent. Try after a few minutes");
  } else {
    await sendVerifyEmail(email);
    return { success: true, message: "Confirmation email sent!" } as const;
  }
}

export async function verifyEmail(email: string, otp: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new NotFoundError();

  const token = await getVerifyTokenByEmail(email, "email");
  if (!token || token.expiresAt <= new Date()) throw new TokenError();

  const key = decrypt(decodeBase64(token.token));
  if (!verifyHOTP(key, 10n, 6, otp)) throw new TokenError();

  await Promise.all([
    updateUserByEmail(email, { emailVerified: new Date() }),
    deleteVerifyToken(token.email, "email"),
  ]);
}

function generateSessionToken() {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);

  return encodeBase32LowerCaseNoPadding(bytes);
}

function generateSessionId(token: string) {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

export async function createSession(
  userId: TableID,
  { ipAddress, userAgent }: { ipAddress: string | null; userAgent: any }
) {
  const token = generateSessionToken();
  const sessionId = generateSessionId(token);
  const session = await insertSession({
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
    ipAddress,
    userAgent,
  });

  await setSessionTokenCookie(token, session.expiresAt);
}

export async function validateSessionToken(token: string) {
  const sessionId = generateSessionId(token);
  const sessionInDb = await findSessionById(sessionId);
  if (!sessionInDb) return null;

  if (Date.now() >= sessionInDb.expiresAt.getTime()) {
    await deleteSession(sessionInDb.id);
    return null;
  }

  const user = await findUser(sessionInDb.userId);
  if (!user) {
    await deleteSession(sessionInDb.id);
    return null;
  }

  if (
    Date.now() >=
    sessionInDb.expiresAt.getTime() - SESSION_REFRESH_INTERVAL_MS
  ) {
    sessionInDb.expiresAt = new Date(Date.now() + SESSION_MAX_DURATION_MS);
    await updateSession(sessionInDb.id, { expiresAt: sessionInDb.expiresAt });
  }

  return { session: sessionInDb, user };
}

export async function invalidateUserSession(userId: TableID) {
  await deleteSessionTokenCookie();
  await deleteSessionByUserId(userId);
}

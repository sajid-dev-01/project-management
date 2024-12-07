import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64 } from "@oslojs/encoding";
import { generateHOTP } from "@oslojs/otp";

import appConfig from "@/configs/app-config";
import authConfig from "@/configs/auth-config";
import VerifyOTPEmail from "@/emails/verify-otp";
import { sendEmail } from "@/lib/email";
import { encrypt } from "@/lib/encryption";
import { generateRandomString } from "@/lib/helpers";
import {
  deleteVerifyToken,
  getVerifyTokenByEmail,
  insertVerifyToken,
} from "@/repositories/verifications";

export async function isVerifyEmailSent(email: string) {
  const existingToken = await getVerifyTokenByEmail(email, "email");
  if (existingToken) {
    if (existingToken.expiresAt >= new Date()) return true;

    await deleteVerifyToken(email, "email");
  }
}

export const sendVerifyEmail = async (email: string) => {
  const str = await generateRandomString(32);
  const key = sha256(new TextEncoder().encode(str));
  const otp = generateHOTP(key, 10n, 6);
  const expiresAt = new Date(Date.now() + authConfig.email.confirmationExpires);
  console.log({ otp });

  await insertVerifyToken({
    email,
    type: "email",
    token: encodeBase64(encrypt(key)),
    expiresAt,
  });
  await sendEmail(
    email,
    `Verify your email for ${appConfig.name}`,
    VerifyOTPEmail({
      code: otp,
      appUrl: appConfig.url,
      appName: appConfig.name,
      expiration: authConfig.email.confirmationExpires,
      companyName: appConfig.companyName,
      companyAddr: appConfig.companyAddr,
    })
  );
};

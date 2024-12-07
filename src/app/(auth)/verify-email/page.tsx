import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import VerifyEmail from "@/features/auth/components/verify-email";
import { AUTH_URI, REGISTRATION_COOKIE } from "@/features/auth/constants";

export default async function VerifyEmailPage() {
  const cookie = await cookies();
  const email = cookie.get(REGISTRATION_COOKIE)?.value;

  if (!email) return redirect(AUTH_URI.signUp);

  return <VerifyEmail email={email} />;
}

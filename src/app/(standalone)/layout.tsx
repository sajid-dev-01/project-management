import { redirect } from "next/navigation";

import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function StandaloneLayout({ children }: Props) {
  const auth = await authenticate();
  if (!auth?.session) return redirect(AUTH_URI.signIn);

  return <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>;
}

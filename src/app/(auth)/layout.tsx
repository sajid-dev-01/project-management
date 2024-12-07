import { redirect } from "next/navigation";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { DEFAULT_LOGIN_REDIRECT } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  const auth = await authenticate();

  if (auth?.user) return redirect(DEFAULT_LOGIN_REDIRECT);

  return (
    <>
      <Header />
      <main className="flex grow flex-col items-center justify-center gap-8 p-4 ">
        {children}
      </main>
      <Footer />
    </>
  );
}

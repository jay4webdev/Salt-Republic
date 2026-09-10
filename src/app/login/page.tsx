import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { getUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/dashboard");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-950 px-5 py-16">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        aria-hidden
        sizes="100vw"
        className="animate-ken-burns object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-navy-950/60" />
      <div className="relative z-10 flex w-full flex-col items-center">
        <div className="mb-10 text-center text-ivory">
          <div className="font-display text-3xl tracking-[0.28em]">
            SALT REPUBLIC
          </div>
          <div className="eyebrow mt-3 text-[0.6rem] text-sand-400">
            Charter Management
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

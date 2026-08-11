import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, pruneSessions } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Sign in | Jetage India CMS" },
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  // Already signed in? Skip the form.
  if (await getCurrentUser()) redirect("/admin");

  // Cheap opportunistic cleanup; this page is hit rarely.
  await pruneSessions();

  const { changed } = await searchParams;

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-jet-bg px-4">
      <LoginForm passwordChanged={changed === "1"} />
    </main>
  );
}

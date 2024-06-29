import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Page() {
  const session = await auth();
  if (session === null) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <h1>Dashboard {session.user?.name}</h1>
    </main>
  );
}

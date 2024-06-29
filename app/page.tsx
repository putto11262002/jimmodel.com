import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <h1>Hello there</h1>j
    <Link href="/auth/sign-in">
    Sign in
    </Link> 
    <Link href={"/admin"}>
    Admin
    </Link>
    </main>
  );
}

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignInForm from "./sign-in-form";

export default async function Page() {
  const session = await auth();
  if (session) {
    redirect("/admin");
  }
  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <div className="mt-4 text-center text-sm">
            Forgot your password?{" "}
            <Link className="underline" href="#">
              Reset it
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

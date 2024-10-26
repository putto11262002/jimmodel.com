import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { authWithoutRedirect } from "@/config";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in-form";
import webConfig from "@/config/web";

export default async function Page() {
  const session = await authWithoutRedirect();
  if (session) {
    redirect("/admin");
  }
  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{webConfig.companyName}</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <div className="mt-4 text-center text-sm">
            Forgot your password?
            <Link className="underline" href="#">
              Reset it
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

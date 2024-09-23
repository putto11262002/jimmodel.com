import Container from "@/components/container";
import ApplicationCreateForm from "@/components/application/forms/application-create-form";
import { Card } from "@/components/card";
import { getApplicationToken } from "@/actions/application/utils";
import { redirect } from "next/navigation";

export default async function Page() {
  const token = await getApplicationToken();
  if (token) {
    redirect("/application");
  }
  return (
    <Container max="sm" className="h-[calc(100vh-theme(spacing.16))] ">
      <Card>
        <ApplicationCreateForm />
      </Card>
    </Container>
  );
}

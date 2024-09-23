import { Card } from "@/components/card";
import UpdateUserPasswordForm from "@/components/user/forms/update-password-form";
import { auth } from "@/config";

export default async function Page() {
  const session = await auth();
  return (
    <Card title="Update My Password">
      <UpdateUserPasswordForm id={session.user.id} />
    </Card>
  );
}

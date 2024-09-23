import { Card } from "@/components/card";
import UpdateUserPasswordForm from "@/components/user/forms/update-password-form";
import { auth } from "@/config";
import permissions from "@/config/permission";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.users.updatePasswordById });
  return (
    <Card headerBorder title="Reset Password">
      <UpdateUserPasswordForm id={id} />
    </Card>
  );
}

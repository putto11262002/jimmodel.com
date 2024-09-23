import { getUserOrThrow } from "@/loaders";
import UpdateUserRoleForm from "@/components/user/forms/update-role-form";
import { Card } from "@/components/card";
import permissions from "@/config/permission";
import { auth } from "@/config";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.users.updateRoleById})
  const user = await getUserOrThrow(id);

  return (
    <Card headerBorder title="Update User Role">
      <UpdateUserRoleForm user={user} />
    </Card>
  );
}

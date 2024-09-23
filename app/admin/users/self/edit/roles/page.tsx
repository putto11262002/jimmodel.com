import { Card } from "@/components/card";
import UpdateUserRoleForm from "@/components/user/forms/update-role-form";
import { auth } from "@/config";
import permissions from "@/config/permission";

export default async function Page() {
  const session = await auth({ permission: permissions.users.updateRoleById });
  return (
    <Card title="Update My Role">
      <UpdateUserRoleForm user={session.user} />
    </Card>
  );
}

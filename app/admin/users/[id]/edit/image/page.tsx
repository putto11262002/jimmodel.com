import { Card } from "@/components/card";
import UpdateUserImageForm from "@/components/user/forms/update-image-form";
import { auth } from "@/config";
import permissions from "@/config/permission";
import { getUserOrThrow } from "@/loaders";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.users.updateImage });
  const user = await getUserOrThrow(id);
  return (
    <Card title="Update Profile Image" headerBorder>
      <UpdateUserImageForm user={user} />
    </Card>
  );
}

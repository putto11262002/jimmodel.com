import { Card } from "@/components/card";
import UpdateUserImageForm from "@/components/user/forms/update-image-form";
import { auth } from "@/config";

export default async function Page() {
  const session = await auth();
  return (
    <Card title="Update My Profile Image">
      <UpdateUserImageForm user={session.user} />
    </Card>
  );
}

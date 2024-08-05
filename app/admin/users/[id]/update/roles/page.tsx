"use client";
import Loader from "@/components/loader";
import { useGetUser, useUpdateUserRoles } from "@/hooks/queries/user";
import UpdateRolesForm from "../../../_components/update-roles-form";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { status } = useSession(permissions.users.updateRoleById);
  const { data: user, isPending } = useGetUser({
    id,
    enabled: status === "authenticated",
  });
  const { mutate, isPending: isUpdatingRole } = useUpdateUserRoles();

  if (isPending || !user || status === "loading") {
    return <Loader />;
  }

  return (
    <UpdateRolesForm
      disabled={isUpdatingRole}
      onSubmit={(data) => mutate({ ...data, id })}
      user={user}
    />
  );
}

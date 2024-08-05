"use client";
import Loader from "@/components/loader";
import {
  useGetSelf,
  useGetUser,
  useUpdateSelfRoles,
} from "@/hooks/queries/user";
import useSession from "@/hooks/use-session";
import UpdateRolesForm from "../../../_components/update-roles-form";
import permissions from "@/config/permission";

export default function Page() {
  const session = useSession(permissions.users.updateSelfRole);
  const { data: user, isPending } = useGetSelf({
    enabled: session.status === "authenticated",
  });
  const { mutate, isPending: isUpdatingRole } = useUpdateSelfRoles();

  if (isPending || !user) {
    return <Loader />;
  }

  return (
    <UpdateRolesForm
      disabled={isUpdatingRole}
      onSubmit={(data) => mutate(data)}
      user={user}
    />
  );
}

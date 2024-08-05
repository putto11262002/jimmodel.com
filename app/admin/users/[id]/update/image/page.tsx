"use client";
import ImageForm from "../../../_components/image-form";
import { useGetUser, useUploadImage } from "@/hooks/queries/user";
import Loader from "@/components/loader";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { status } = useSession(permissions.users.addImageById);
  const {
    data: user,
    isSuccess,
    isPending,
  } = useGetUser({ id, enabled: status === "authenticated" });
  const { mutate } = useUploadImage();
  if (isPending || !isSuccess) {
    return <Loader />;
  }
  return (
    <ImageForm onSubmit={(file) => mutate({ file, userId: id })} user={user} />
  );
}

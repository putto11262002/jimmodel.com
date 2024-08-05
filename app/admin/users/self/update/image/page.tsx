"use client";
import ImageForm from "../../../_components/image-form";
import { useGetSelf, useUploadSelfImage } from "@/hooks/queries/user";
import Loader from "@/components/loader";

export default function Page() {
  const { data: user, isSuccess, isPending } = useGetSelf();
  const { mutate } = useUploadSelfImage();
  if (isPending || !isSuccess) {
    return <Loader />;
  }
  return <ImageForm onSubmit={(file) => mutate({ file })} user={user} />;
}

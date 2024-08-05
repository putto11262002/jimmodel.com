"use client";
import { useUpdateUserPassword } from "@/hooks/queries/user";
import PasswordForm from "../../../_components/password-form";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { mutate, isPending } = useUpdateUserPassword();
  return (
    <PasswordForm
      isPending={isPending}
      onSubmit={(data) => mutate({ ...data, id })}
    />
  );
}

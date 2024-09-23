"use client";
import Avatar from "@/components/avatar";
import { Input } from "@/components/ui/input";
import { UserWithoutSecrets } from "@/lib/domains";
import { useFormState } from "react-dom";
import { updateUserImageAction } from "@/actions/users";
import useActionToast from "@/hooks/use-action-toast";
import InputFormItem from "@/components/form/server-action/input-form-item";
import AsyncButton from "@/components/shared/buttons/async-button";

export default function UpdateUserImageForm({
  user,
}: {
  user: Pick<UserWithoutSecrets, "id" | "name" | "imageId">;
}) {
  const [state, action, pending] = useFormState(updateUserImageAction, {
    status: "idle",
  });
  useActionToast({ state });
  return (
    <form action={action}>
      <div className="grid gap-4">
        <Avatar size="lg" fileId={user.imageId} name={user.name} />
        <Input type="hidden" name="id" value={user.id} />

        <InputFormItem state={state} name="file" type="file" />
        <div className="flex justify-end">
          <AsyncButton type="submit" pending={pending}>
            Update
          </AsyncButton>
        </div>
      </div>
    </form>
  );
}

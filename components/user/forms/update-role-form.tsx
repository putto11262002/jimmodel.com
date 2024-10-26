"use client";
import FormItem from "@/components/form/form-item";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { upperFirst } from "lodash";
import { UserWithoutSecrets } from "@/lib/domains";
import { updateUserRolesAction } from "@/actions/users";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import useActionToast from "@/hooks/use-action-toast";
import AsyncButton from "@/components/shared/buttons/async-button";
import Alert from "@/components/alert";
import { USER_ROLE_LABEL_VALUE_PAIRS } from "@/db/constants";

export default function UpdateUserRoleForm({
  user,
}: {
  user: Pick<UserWithoutSecrets, "id" | "roles">;
}) {
  const [state, action, pending] = useFormState(updateUserRolesAction, {
    status: "idle",
  });

  useActionToast({ state });

  const [checked, setChecked] = useState<Record<string, boolean | undefined>>(
    Object.fromEntries(user.roles.map((role) => [role, true]))
  );

  useEffect(() => {
    setChecked(Object.fromEntries(user.roles.map((role) => [role, true])));
  }, [user]);
  if (user.roles.includes("root")) {
    return <Alert variant="warning">Cannot modify root user role</Alert>;
  }

  return (
    <>
      <form action={action} className="grid gap-4">
        {USER_ROLE_LABEL_VALUE_PAIRS.filter(
          (role) => role.value !== "root"
        ).map(({ value, label }, index) => (
          <FormItem className="" orientation="horizontal" key={index}>
            <Checkbox
              name="roles"
              value={value}
              checked={checked[value]}
              onCheckedChange={(c) =>
                typeof c === "boolean" &&
                setChecked((prev) => ({ ...prev, [value]: c }))
              }
            />
            <Label className="">{label}</Label>
          </FormItem>
        ))}
        <input name="id" value={user.id} hidden />
        <div className="flex justify-end">
          <AsyncButton pending={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}

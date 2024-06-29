"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserRole, userRoles } from "@/db/schemas/users";
import { useFieldArray, useForm } from "react-hook-form";
import _ from "lodash";
import { SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { updateUserRoleAction } from "@/lib/actions/user";
import { useUserActions } from "../actions-context";
import { useQuery } from "@tanstack/react-query";

export default function UpdateRoleForm() {
  const { target, done: completedAction } = useUserActions();

  const form = useForm<{ roles: { value: UserRole }[] }>({
    defaultValues: {
      roles: target?.roles?.map((role) => ({ value: role })) || [],
    },
  });

  const roles = useFieldArray({
    name: "roles",
    control: form.control,
  });

  const onSubmit = async (formData: { roles: { value: UserRole }[] }) => {
    if (target === null) return;
    await updateUserRoleAction(
      target.id,
      formData.roles.map(({ value }) => value),
    );
    completedAction();
  };

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="roles"
          control={form.control}
          render={({}) => (
            <FormItem className="space-y-3">
              <FormLabel>Roles</FormLabel>
              {userRoles.map((role) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <Checkbox
                    checked={
                      roles.fields.find(({ value }) => value === role) !==
                      undefined
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        roles.append({ value: role });
                      } else {
                        const index = roles.fields.findIndex(
                          ({ value }) => value === role,
                        );
                        if (index !== -1) {
                          roles.remove(index);
                        }
                      }
                    }}
                  />
                  <FormLabel className="text-sm font-normal">
                    {_.upperFirst(role)}
                  </FormLabel>
                </FormItem>
              ))}
            </FormItem>
          )}
        />
        <SheetFooter>
          <Button>Save</Button>
        </SheetFooter>
      </form>
    </Form>
  );
}

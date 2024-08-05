"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UserRole, userRoles } from "@/db/schemas";
import { UserWithoutSecrets } from "@/lib/types/user";
import { upperFirst } from "lodash";
import { useFieldArray, useForm } from "react-hook-form";

export default function UpdatRolesForm({
  user,
  onSubmit,
  disabled,
}: {
  user: UserWithoutSecrets;
  onSubmit: (data: { roles: UserRole[] }) => void;
  disabled?: boolean;
}) {
  const form = useForm<{ roles: { value: UserRole }[] }>({
    defaultValues: {
      roles: user?.roles?.map((role) => ({ value: role })) || [],
    },
  });

  const roles = useFieldArray({
    name: "roles",
    control: form.control,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onSubmit({ roles: data.roles.map(({ value }) => value) }),
        )}
      >
        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>{" "}
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <FormField
                name="roles"
                control={form.control}
                render={({}) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Roles</FormLabel>
                    {userRoles.map((role) => (
                      <FormItem
                        key={role}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
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
                          {upperFirst(role)}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="py-4 border-t">
            <Button disabled={disabled}>Save</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

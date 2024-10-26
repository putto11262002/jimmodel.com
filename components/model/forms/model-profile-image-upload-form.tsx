"use client";
import { updateModelProfileImageAction } from "@/actions/model";
import Avatar from "@/components/avatar";
import FormItem from "@/components/form/form-item";
import FormMessage from "@/components/form/form-message";
import AsyncButton from "@/components/shared/buttons/async-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import routes from "@/config/routes";
import { Model } from "@/lib/domains";
import Image from "next/image";
import { useFormState } from "react-dom";

export default function ModelProfileImageUploadForm({
  model,
}: {
  model: Pick<Model, "profileImageId" | "name" | "id">;
}) {
  const [state, action, pending] = useFormState(updateModelProfileImageAction, {
    status: "idle",
  });

  return (
    <div className="grid gap-4">
      <form className="grid gap-4" action={action}>
        <input type="hidden" name="id" value={model.id} />
        <FormItem>
          <Label>New Profile Image</Label>
          <Input name="file" type="file" />
          <FormMessage
            error={
              state.status === "validationError" ? state.data?.file : undefined
            }
          />
        </FormItem>
        <div>
          <AsyncButton type="submit" pending={pending}>
            Upload
          </AsyncButton>
        </div>
      </form>
    </div>
  );
}

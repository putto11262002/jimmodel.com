"use client";
import { addApplicationExperienceAction } from "@/actions/application";
import FormItem from "@/components/form/form-item";
import FormMessage from "@/components/form/form-message";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRY_LABEL_KEY_PAIRS } from "@/db/constants";
import useActionToast from "@/hooks/use-action-toast";
import { useEffect } from "react";
import { useFormState } from "react-dom";

export default function ApplicationExperienceCreateForm({
  done,
}: {
  done?: () => void;
}) {
  const [state, action, pending] = useFormState(
    addApplicationExperienceAction,
    {
      status: "idle",
    }
  );

  useActionToast({ state });

  useEffect(() => {
    if (state.status === "success") {
      done && done();
    }
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <FormItem>
        <Label>Year</Label>
        <Input name="year" />
        <FormMessage
          error={
            state.status === "validationError" ? state.data?.year : undefined
          }
        />
      </FormItem>

      <FormItem>
        <Label>Media</Label>
        <Input name="media" />
        <FormMessage
          error={
            state.status === "validationError" ? state.data?.media : undefined
          }
        />
      </FormItem>

      <FormItem>
        <Label>Product</Label>
        <Input name="product" />
        <FormMessage
          error={
            state.status === "validationError" ? state.data?.product : undefined
          }
        />
      </FormItem>

      <FormItem>
        <Label>Country</Label>
        <Select name="country">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {COUNTRY_LABEL_KEY_PAIRS.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage
          error={
            state.status === "validationError" ? state.data?.country : undefined
          }
        />
      </FormItem>
      <div className="flex justify-end">
        <AsyncButton pending={pending}>Save</AsyncButton>
      </div>
    </form>
  );
}

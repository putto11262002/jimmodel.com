"use client";
import type { Model } from "@/lib/domains";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import {
  BOOKING_STATUS_LABEL_VALUE_PAIRS,
  MODEL_CATEGORY_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import { useFormState } from "react-dom";
import { updateModelSettingAction } from "@/actions/model";
import FormItem from "@/components/form/form-item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormMessage from "@/components/form/form-message";
import useActionToast from "@/hooks/use-action-toast";
import AsyncButton from "@/components/shared/buttons/async-button";

export default function ModelSettingsUpdateForm({ model }: { model: Model }) {
  const [state, action, pending] = useFormState(updateModelSettingAction, {
    status: "idle",
  });

  useActionToast({ state });

  return (
    <>
      <form action={action} className="grid gap-4">
        <input type="hidden" name="id" value={model.id} />
        <FormItem>
          <Label>Booking Status</Label>
          <Select name="bookingStatus" defaultValue={model.bookingStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BOOKING_STATUS_LABEL_VALUE_PAIRS.map(
                ({ label, value }, index) => (
                  <SelectItem value={value} key={index}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
            <FormMessage
              error={
                state.status === "validationError"
                  ? state.data?.bookingStatus
                  : undefined
              }
            />
          </Select>
        </FormItem>

        <FormItem>
          <Label>Published</Label>
          <Select
            name="published"
            defaultValue={model.published ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
            <FormMessage
              error={
                state.status === "validationError"
                  ? state.data?.published
                  : undefined
              }
            />
          </Select>
        </FormItem>

        <FormItem>
          <Label>Category</Label>
          <Select name="category" defaultValue={model.category}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODEL_CATEGORY_LABEL_VALUE_PAIRS.map(
                ({ label, value }, index) => (
                  <SelectItem value={value} key={index}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
            <FormMessage
              error={
                state.status === "validationError"
                  ? state.data?.category
                  : undefined
              }
            />
          </Select>
        </FormItem>

        <div className="flex justify-end">
          <AsyncButton disabled={pending}>Save</AsyncButton>
        </div>
      </form>
    </>
  );
}

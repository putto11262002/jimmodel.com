"use client";
import type { Model } from "@/lib/domains";
import {
  BOOKING_STATUS_LABEL_VALUE_PAIRS,
  MODEL_CATEGORY_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import { deleteModelAction, updateModelSettingAction } from "@/actions/model";
import FormItem from "@/components/form/form-item";
import { Label } from "@/components/ui/label";
import useActionToast from "@/hooks/use-action-toast";
import AutoForm from "@/components/shared/auto-form";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import useActionState from "@/hooks/use-action-state";
import AsyncButton from "@/components/shared/buttons/async-button";

export default function ModelSettingsUpdateForm({ model }: { model: Model }) {
  const { state, dispatch, pending } = useActionState(
    updateModelSettingAction,
    {
      status: "idle",
    }
  );

  const { dispatch: deleteModel, pending: pendingDelete } =
    useActionState(deleteModelAction);

  return (
    <>
      <div className="grid gap-4">
        <AutoForm action={dispatch}>
          <input type="hidden" name="id" value={model.id} />
          <SelectFormItem
            name="bookingStatus"
            label="Booking Status"
            defaultValue={model.bookingStatus}
            options={BOOKING_STATUS_LABEL_VALUE_PAIRS}
          />
        </AutoForm>

        <FormItem>
          <input type="hidden" name="id" value={model.id} />
          <SelectFormItem
            name="category"
            label="Category"
            defaultValue={model.category}
            options={MODEL_CATEGORY_LABEL_VALUE_PAIRS}
          />
        </FormItem>

        <form action={dispatch}>
          <input
            type="hidden"
            name="published"
            defaultValue={String(!model.published)}
          />
          <input type="hidden" name="id" value={model.id} />
          <FormItem>
            <Label>Published</Label>
            <div>
              <AsyncButton
                pending={pending}
                variant={model.published ? "warning" : "success"}
                type="submit"
              >
                {model.published ? "Unpublish" : "Publish"}
              </AsyncButton>
            </div>
          </FormItem>
        </form>

        <form action={deleteModel}>
          <input type="hidden" name="id" value={model.id} />
          <FormItem>
            <Label>Delete</Label>
            <div>
              <AsyncButton
                pending={pendingDelete}
                variant="destructive"
                type="submit"
              >
                Delete
              </AsyncButton>
            </div>
          </FormItem>
        </form>
      </div>
    </>
  );
}

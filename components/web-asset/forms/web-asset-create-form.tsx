import { createWebAssetAction } from "@/actions/web-asset";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import { WEB_ASSET_TAG_LABEL_VALUE_PAIRS } from "@/db/constants";
import { useActionState, useEffect } from "react";

export default function WebAssetCreateForm({ done }: { done?: () => void }) {
  const [state, action, pending] = useActionState(createWebAssetAction, {
    status: "idle",
  });
  useEffect(() => {
    if (state.status === "success" && done) {
      done();
    }
  }, [state]);
  return (
    <form action={action} className="grid gap-4">
      <InputFormItem name="file" label="File" type="file" state={state} />
      <InputFormItem name="alt" label="Alt" state={state} />
      <SelectFormItem
        name="tag"
        label="Tag"
        options={WEB_ASSET_TAG_LABEL_VALUE_PAIRS}
        state={state}
      />
      <div className="flex justify-end">
        <AsyncButton pending={pending}>Create</AsyncButton>
      </div>
    </form>
  );
}

import { updateWebAssetAction } from "@/actions/web-asset";
import InputFormItem from "@/components/form/server-action/input-form-item";
import MultipleSelectFormItem from "@/components/form/server-action/multiple-select";
import AsyncButton from "@/components/shared/buttons/async-button";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import {
  WEB_ASSET_TAG_LABEL_VALUE_PAIRS,
  WEB_ASSET_TAG_LABELS,
} from "@/db/constants";
import { WebAsset } from "@/lib/domains";
import { useActionState, useEffect } from "react";

export default function WebAssetUpdateFrom({
  webAsset,
  done,
  trigger,
}: {
  webAsset: WebAsset;
  done?: () => void;
  trigger?: React.ReactNode;
}) {
  const [state, action, pending] = useActionState(updateWebAssetAction, {
    status: "idle",
  });
  useEffect(() => {
    if (state.status === "success" && done) {
      done();
    }
  }, [state]);
  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={webAsset.id} />
      <InputFormItem
        name="alt"
        label="Alt"
        state={state}
        defaultValue={webAsset.alt}
      />
      <MultipleSelectFormItem
        transform={(value) =>
          WEB_ASSET_TAG_LABELS[value as keyof typeof WEB_ASSET_TAG_LABELS]
        }
        name="tag"
        label="Tag"
        options={WEB_ASSET_TAG_LABEL_VALUE_PAIRS}
        state={state}
        defaultValue={webAsset.tag}
      />
      {trigger ? (
        trigger
      ) : (
        <div className="">
          <AsyncButton pending={pending}>Update</AsyncButton>
        </div>
      )}
    </form>
  );
}

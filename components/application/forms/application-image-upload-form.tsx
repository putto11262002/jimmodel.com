import { addApplicationImageAction } from "@/actions/application";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import { APPLICATION_IMAGE_TYPE_LABLE_VALUE_PAIRS } from "@/db/constants";
import { useActionState, useEffect } from "react";

export default function ApplicationImageUploadForm({
  done,
}: {
  done?: () => void;
}) {
  const [state, action, pending] = useActionState(addApplicationImageAction, {
    status: "idle",
  });
  useEffect(() => {
    if (state.status === "success" && done) {
      done();
    }
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <InputFormItem type="file" name="file" label="Image" state={state} />
      <SelectFormItem
        name="type"
        label="Type"
        state={state}
        options={APPLICATION_IMAGE_TYPE_LABLE_VALUE_PAIRS}
      />
      <div className="flex justify-end">
        <AsyncButton pending={pending}>Upload</AsyncButton>
      </div>
    </form>
  );
}

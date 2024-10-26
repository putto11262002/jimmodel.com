import { uploadModelImageAction } from "@/actions/model";
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
import { MODEL_IMAGE_TYPE_LABEL_VALUE_PAIRS } from "@/db/constants";
import useActionToast from "@/hooks/use-action-toast";
import { useEffect } from "react";
import { useFormState } from "react-dom";

export default function ModelImageForm({
  modelId,
  done,
}: {
  modelId: string;
  done?: () => void;
}) {
  const [state, action, pending] = useFormState(uploadModelImageAction, {
    status: "idle",
  });
  useActionToast({ state });
  useEffect(() => {
    if (state.status === "success") {
      done && done();
    }
  }, [state]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="id" value={modelId} />
      <FormItem>
        <Label>File</Label>
        <Input name="file" type="file" />
        <FormMessage
          error={
            state.status === "validationError" ? state.data?.file : undefined
          }
        />
      </FormItem>

      <FormItem>
        <Label>Type</Label>
        <Select name="type">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODEL_IMAGE_TYPE_LABEL_VALUE_PAIRS.map(
              ({ value, label }, index) => (
                <SelectItem key={index} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
        <FormMessage
          error={
            state.status === "validationError" ? state.data?.type : undefined
          }
        />
      </FormItem>
      <div className="flex justify-end">
        <AsyncButton type="submit" pending={pending}>
          Upload
        </AsyncButton>
      </div>
    </form>
  );
}

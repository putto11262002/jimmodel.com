import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import { useEffect, useState } from "react";
import FormItem from "../form-item";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import FormMessage from "../form-message";

export default function CheckboxFormItem<
  TName extends string,
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({
  name,
  label,
  defaultValue,
  state,
  disabled,
}: {
  name: TName;
  label?: React.ReactNode;
  defaultValue?: boolean | null;
  state: T;
  disabled?: boolean;
}) {
  const [checked, setChecked] = useState<boolean>(defaultValue ?? false);
  useEffect(() => {
    setChecked(defaultValue ?? false);
  }, [defaultValue]);

  return (
    <FormItem>
      {label && <Label>{label}</Label>}
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <Checkbox
        disabled={disabled}
        checked={checked}
        onCheckedChange={(c) => typeof c === "boolean" && setChecked(c)}
      />
      <FormMessage
        error={
          state.status === "validationError" ? state?.data?.[name] : undefined
        }
      />
    </FormItem>
  );
}

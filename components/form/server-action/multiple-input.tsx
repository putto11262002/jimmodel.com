import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import FormItem from "../form-item";
import { Label } from "@/components/ui/label";
import FormMessage from "../form-message";
import { useEffect, useState } from "react";
import MultipleInput from "../base/multiple-input";

export default function MultipleInputFormItem<
  TName extends string,
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({
  name,
  label,
  defaultValue,
  state,
}: {
  name: TName;
  label?: string;
  defaultValue?: string[] | null;
  state: T;
}) {
  useEffect(() => {
    if (defaultValue) {
      setValues(defaultValue);
    }
  }, [defaultValue]);

  const [values, setValues] = useState<string[]>(defaultValue ?? []);
  return (
    <FormItem>
      {label && <Label>{label}</Label>}
      {values.map((value, index) => (
        <input type="hidden" key={index} name={name} value={value} />
      ))}
      <MultipleInput value={values} onChange={setValues} />
      <FormMessage
        error={
          state.status === "validationError" ? state.data?.[name] : undefined
        }
      />
    </FormItem>
  );
}

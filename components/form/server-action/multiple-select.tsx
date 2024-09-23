import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import FormItem from "../form-item";
import { Label } from "@/components/ui/label";
import FormMessage from "../form-message";
import { useEffect, useState } from "react";
import MultipleSelect from "../base/muliple-select";

export default function MultipleSelectFormItem<
  TName extends string,
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({
  name,
  label,
  defaultValue,
  state,
  options,
  transform,
}: {
  name: TName;
  label?: string;
  defaultValue?: string[] | null;
  state: T;
  options: { label?: string; value: string }[];
  transform?: (value: string) => string;
}) {
  const [values, setValues] = useState<string[]>(defaultValue ?? []);
  useEffect(() => {
    if (defaultValue) {
      setValues(defaultValue);
    }
  }, [defaultValue]);
  return (
    <FormItem>
      {label && <Label>{label}</Label>}
      {values.map((value, index) => (
        <input type="hidden" key={index} name={name} value={value} />
      ))}
      <MultipleSelect
        transform={transform}
        options={options}
        value={values}
        onChange={setValues}
      />
      <FormMessage
        error={
          state.status === "validationError" ? state.data?.[name] : undefined
        }
      />
    </FormItem>
  );
}

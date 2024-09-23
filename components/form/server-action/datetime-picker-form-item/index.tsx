import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import FormItem from "../../form-item";
import { Label } from "@/components/ui/label";
import FormMessage from "../../form-message";
import DatetimePicker from "./datetime-picker";

export default function DatetimePickerFormItem<
  TName extends string,
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({
  name,
  label,
  defaultValue,
  state,
  onChange,
}: {
  name: TName;
  label?: string;
  defaultValue?: string | null;
  state?: T;
  onChange?: (date: Date | undefined) => void;
}) {
  return (
    <FormItem>
      {label && <Label>{label}</Label>}
      <DatetimePicker
        onChange={onChange}
        name={name}
        defaultValue={defaultValue ?? undefined}
      />
      {state && (
        <FormMessage
          error={
            state.status === "validationError" ? state.data?.[name] : undefined
          }
        />
      )}
    </FormItem>
  );
}

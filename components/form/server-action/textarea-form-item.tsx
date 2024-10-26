import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import FormItem from "../form-item";
import { Label } from "@/components/ui/label";
import FormMessage from "../form-message";
import { Textarea } from "@/components/ui/textarea";

export default function TextareaFormItem<
  TName extends string,
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({
  name,
  label,
  defaultValue,
  state,
  description,
}: {
  name: TName;
  label?: string;
  defaultValue?: string | null | number;
  state?: T;
  description?: string;
}) {
  return (
    <FormItem>
      {label && <Label>{label}</Label>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <Textarea name={name} defaultValue={defaultValue ?? undefined} />
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

import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import FormItem from "../form-item";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FormMessage from "../form-message";
import { BoxSize } from "@/components/shared/types/box";
import { useAutoForm } from "@/components/shared/auto-form";

export default function InputFormItem<
  TName extends string,
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({
  name,
  label,
  defaultValue,
  state,
  size = "default",
  className,
  type,
  description,
}: {
  name: TName;
  label?: string;
  defaultValue?: string | null | number;
  state?: T;
  size?: BoxSize;
  className?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  description?: string;
}) {
  const { onChange } = useAutoForm();
  return (
    <FormItem className={className} size={size}>
      {label && <Label size={size}>{label}</Label>}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <Input
        onChange={(e) => e.target.value !== defaultValue && onChange()}
        type={type}
        size={size}
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

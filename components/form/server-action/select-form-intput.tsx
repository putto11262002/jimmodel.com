"use client";
import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import FormItem from "../form-item";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormMessage from "../form-message";
import { BoxSize } from "@/components/shared/types/box";
import { useAutoForm } from "@/components/shared/auto-form";

export default function SelectFormItem<
  TName extends string,
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({
  name,
  label,
  defaultValue,
  state,
  options,
  size = "default",
  className,
  onValueChange,
  placeholder,
  prefix,
}: {
  name: TName;
  label?: string;
  defaultValue?: string | null;
  state?: T;
  options: { label?: string; value: string }[];
  size?: BoxSize;
  className?: string;
  onValueChange?: (v: string) => void;
  placeholder?: string;
  prefix?: React.ReactNode;
}) {
  const { onChange: _onChange } = useAutoForm();
  return (
    <FormItem className={className} size={size}>
      {label && <Label size={size}>{label}</Label>}
      <Select
        onValueChange={(v) => {
          console.log(v);
          if (v === defaultValue) return;
          onValueChange && onValueChange(v);
          _onChange();
        }}
        name={name}
        defaultValue={defaultValue}
      >
        <SelectTrigger className="" size={size}>
          <div className="flex items-center gap-2">
            {prefix && (
              <span className="text-xs text-muted-foreground">{prefix}</span>
            )}
            <SelectValue
              placeholder={
                <span className="text-muted-foreground">
                  {placeholder ?? `Select ${label ?? name}`}
                </span>
              }
            />
          </div>
        </SelectTrigger>

        <SelectContent>
          {options.map(({ value, label }, index) => (
            <SelectItem size={size} key={index} value={value}>
              {label || value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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

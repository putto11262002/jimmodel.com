import { BoxSize } from "@/components/shared/types/box";
import RichSelect, {
  MultipleRichSelectProps,
  RichSelectProps,
  SingleRichSelectProps,
} from "../base/rich-select";
import FormItem from "../form-item";
import { useAutoForm } from "@/components/shared/auto-form";
import React, { ReactNode, useCallback, useEffect } from "react";

function RichSelectFormItem(
  props: SingleRichSelectProps & { name: string }
): React.ReactNode;

function RichSelectFormItem(
  props: MultipleRichSelectProps & { name: string }
): React.ReactNode;

function RichSelectFormItem({
  name,
  mode,
  size,
  ...props
}: RichSelectProps & { name: string }) {
  const { onChange } = useAutoForm();
  const [value, setValue] = React.useState<string[] | undefined | null>(null);
  const handleChange = useCallback((v: string | string[] | undefined) => {
    if (typeof v === "string") {
      return setValue([v]);
    }
    if (Array.isArray(v)) {
      return setValue(v);
    }
    setValue(v);
  }, []);

  useEffect(() => {
    if (value === null) return;
    onChange();
  }, [value]);

  return (
    <FormItem size={size}>
      {value?.map((v, index) => (
        <input key={index} type="hidden" name={name} value={v} />
      ))}
      {mode === "single" ? (
        <RichSelect
          {...props}
          onChange={handleChange}
          mode="single"
          size={size}
        />
      ) : (
        <RichSelect
          {...props}
          onChange={handleChange}
          mode="multiple"
          size={size}
        />
      )}
    </FormItem>
  );
}

export default RichSelectFormItem;

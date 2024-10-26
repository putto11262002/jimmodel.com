import { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import React from "react";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "./types";
import { getFormItemClass, getFormLabelClass } from "./utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type InputFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> & {
  options: { label?: string; value: string }[];
  transformIn?: (value: TFieldValues[TName]) => string;
  transformOut?: (value: string) => TFieldValues[TName];
};

const getFormSelectTriggerClass = ({
  size,
}: {
  size: Exclude<InputFormFieldProps["size"], undefined>;
}) => cn(size === "sm" && "h-7 ");

const SelectFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  colSpan = "full",
  size = "md",
  transformOut,
  transformIn,
  options,
}: InputFormFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={getFormItemClass({ size, colSpan })}>
          {label && (
            <FormLabel className={getFormLabelClass({ size })}>
              {label}
            </FormLabel>
          )}
          <Select
            name={name}
            defaultValue={transformIn ? transformIn(field.value) : field.value}
            onValueChange={(value) =>
              field.onChange(transformOut ? transformOut(value) : value)
            }
          >
            <FormControl>
              <SelectTrigger className={getFormSelectTriggerClass({ size })}>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(({ label, value }, index) => (
                <SelectItem value={value} key={index}>
                  {label || value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};

export default SelectFormField;

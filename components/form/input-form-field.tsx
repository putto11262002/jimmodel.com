import { FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import React from "react";
import { cn } from "@/lib/utils";
import { FormFieldProps } from "./types";
import { getFormItemClass, getFormLabelClass } from "./utils";
import { BoxSize } from "../shared/types/box";

type InputFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> & {
  inputProps?: Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "size"
  > & { size?: BoxSize };
};

const getFormInputClass = ({
  size,
}: {
  size: Exclude<InputFormFieldProps["size"], undefined>;
}) => cn(size === "sm" && "h-7 px-2");

const InputFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  colSpan = "full",
  size = "md",
  inputProps,
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
          <FormControl>
            <Input
              {...field}
              {...inputProps}
              className={getFormInputClass({ size })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};

export default InputFormField;

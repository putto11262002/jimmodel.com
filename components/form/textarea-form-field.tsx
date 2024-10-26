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
import { Textarea } from "../ui/textarea";

type InputFormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = FormFieldProps<TFieldValues, TName> & {
  textareaProps?: Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  >;
};

const getFormTextarea = ({
  size,
}: {
  size: Exclude<InputFormFieldProps["size"], undefined>;
}) => cn(size === "sm" && "h-7 px-2");

const TextareaFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  colSpan = "full",
  size = "md",
  textareaProps,
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
            <Textarea
              {...field}
              {...textareaProps}
              className={getFormTextarea({ size })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    ></FormField>
  );
};

export default TextareaFormField;

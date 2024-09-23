import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import React from "react";

export type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  label?: React.ReactNode;
  colSpan?: number | "full";
  size?: "sm" | "md";
} & Omit<ControllerProps<TFieldValues, TName>, "render">;

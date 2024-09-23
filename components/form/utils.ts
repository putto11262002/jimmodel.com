import { cn } from "@/lib/utils";
import { FormFieldProps } from "./types";

export const getFormItemClass = ({
  size,
  colSpan,
}: {
  size: Exclude<FormFieldProps["size"], undefined>;
  colSpan: Exclude<FormFieldProps["colSpan"], undefined>;
}) => cn(size === "sm" && "space-y-1", `col-span-${colSpan}`);

export const getFormLabelClass = ({
  size,
}: {
  size: Exclude<FormFieldProps["size"], undefined>;
}) => cn(size === "sm" && "text-xs");

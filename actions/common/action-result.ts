import { FieldsValidationError } from "@/lib/types/validation";
export type BaseActionResult<T = undefined> = T extends undefined
  ?
      | EmptyActionResult<"success">
      | EmptyActionResult<"error">
      | IdelActionResult
      | ValidationErrorActionResult<any>
  :
      | ValidationErrorActionResult<T>
      | EmptyActionResult<"success">
      | EmptyActionResult<"error">
      | IdelActionResult;
export type ActionResultWithDataOnSuccess<TData> =
  | ActionResult<"success", TData>
  | EmptyActionResult<"error">
  | IdelActionResult;

export type ActionResult<TStatus extends string, TData> = {
  status: TStatus;
  data: TData;
  message?: string;
};

export type EmptyActionResult<TStatus extends string> = Omit<
  ActionResult<TStatus, undefined>,
  "data"
> &
  Partial<Pick<ActionResult<TStatus, undefined>, "data">>;

export type IdelActionResult = EmptyActionResult<"idle">;

export type ValidationErrorActionResult<T> = ActionResult<
  "validationError",
  FieldsValidationError<T>
>;

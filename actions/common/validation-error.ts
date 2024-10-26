export type FieldsValidationError<T> = { [K in keyof T]?: string[] | undefined };

export type SafeFormDataValue =
  | string
  | number
  | boolean
  | File
  | null
  | undefined;

export type SafeFormDataEntry = SafeFormDataValue | SafeFormDataValue[];

export type SafeFormDataObject = Record<string, SafeFormDataEntry>;

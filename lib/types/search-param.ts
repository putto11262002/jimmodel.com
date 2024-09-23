export type SearchParamSafeValue = string | number | boolean | null | undefined;

export type SearchParamSafeEntry =
  | SearchParamSafeValue
  | SearchParamSafeValue[];

export type SearchParamSafeObject = Record<string, SearchParamSafeEntry>;

export type SearchParamValue = string | string[];

export type SearchParamsObj = Record<string, SearchParamValue>;

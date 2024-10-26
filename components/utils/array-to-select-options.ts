import { upperFirst } from "lodash";

export const arrayToSelectOptions = <T extends string[] | readonly string[]>(
  arr: T
) =>
  arr.map((v) => ({
    label: upperFirst(v),
    value: v,
  }));

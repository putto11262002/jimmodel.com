import dayjs from "dayjs";

const unionFromArray = <T extends string, Arr extends T[]>(
  arr: [...Arr],
): Arr[number] => null as any;

const union = <T extends { name: string }, F extends () => T, Arr extends F[]>(
  arr: [...Arr],
): Arr[number] => null as any;

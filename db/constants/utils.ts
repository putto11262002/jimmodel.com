import { snakeCaseToTitle } from "@/lib/utils/text";

export function generateLabelsMap<T extends readonly string[]>(
  items: T,
  transform: (item: T[number]) => string = snakeCaseToTitle
): { [key in T[number]]: string } {
  return items.reduce((acc, item) => {
    acc[item as T[number]] = transform(item); // Explicitly cast item
    return acc;
  }, {} as { [key in T[number]]: string });
}

export function generateLabelValuePairs<T extends readonly string[]>(
  items: T,
  transform: (item: T[number]) => string = snakeCaseToTitle
): { label: string; value: T[number] }[] {
  return items.map((item) => ({
    label: transform(item),
    value: item,
  }));
}

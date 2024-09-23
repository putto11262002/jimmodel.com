export function camelCaseToText(s: string) {
  const result = s.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function stringToIntOrUndefined(s: string): number | undefined {
  const regex = /^\d+$/;
  if (!regex.test(s)) {
    return undefined;
  }
  return Number(s);
}

export function snakeCaseToWords(s: string) {
  return s.replace(/_/g, " ");
}

export function snakeCaseToTitle(s: string) {
  return snakeCaseToWords(s).replace(/\b\w/g, (l) => l.toUpperCase());
}

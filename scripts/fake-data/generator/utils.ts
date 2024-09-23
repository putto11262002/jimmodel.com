export const maybe = <T>(
  main: T | (() => T),
  fallback: T | (() => T),
  likelihood = 0.5
): T => {
  if (typeof main === "function") {
    return Math.random() < likelihood
      ? (main as () => T)()
      : (fallback as () => T)();
  }
  return Math.random() < likelihood ? main : (fallback as T);
};

export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const callNTimes = <T>(n: number, fn: () => T): T[] => {
  const results: T[] = [];
  for (let i = 0; i < n; i++) {
    results.push(fn());
  }
  return results;
};

export const pickItem = <T>(array: T[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

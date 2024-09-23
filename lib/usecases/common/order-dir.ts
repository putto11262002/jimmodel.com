export const orderDirs = ["asc", "desc"] as const;

export type OrderDir = typeof orderDirs[number];
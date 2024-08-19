export const genders = ["male", "female", "non-binary"] as const;

export type Gender = (typeof genders)[number];

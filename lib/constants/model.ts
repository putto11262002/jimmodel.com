export const modelGenders = ["male", "female", "non-binary"] as const;
export const modelCategories = [...modelGenders, "kids"] as const;

export const modelImageTypes = [
  "book",
  "polaroid",
  "composite",
  "application",
  "other",
] as const;

import { NewModel } from "@/db/schemas";

export type ModelCreateInput = {
  category?: NewModel["category"];
} & Omit<
  NewModel,
  "id" | "createdAt" | "updatedAt" | "profileImageId" | "published" | "category"
>;

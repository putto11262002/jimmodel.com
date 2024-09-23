import { NewModel } from "@/db/schemas";

export type ModelUpdateInput = Partial<
  Omit<
    NewModel,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "category"
    | "profileImageId"
    | "published"
    | "bookingStatus"
  >
>;

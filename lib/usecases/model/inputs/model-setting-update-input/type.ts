import { NewModel } from "@/db/schemas";

export type ModelSettingUpdateInput = Partial<
  Pick<NewModel, "bookingStatus" | "category" | "published">
>;

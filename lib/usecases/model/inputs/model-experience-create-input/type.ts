import { NewModelExperience } from "@/db/schemas";

export type ModelExperienceCreateInput = Omit<
  NewModelExperience,
  "id" | "modelId"
>;

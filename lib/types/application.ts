import {
  applicationExperienceTable,
  applicationImageTable,
  ApplicationImageType,
  applicationStatuses,
  applicationTable,
} from "@/db/schemas/application";

export type Application = typeof applicationTable.$inferSelect & {
  experiences: ApplicationExperience[] | null;
};

export type ApplicationCreateInput = Omit<
  typeof applicationTable.$inferInsert,
  "status" | "createdAt" | "updatedAt"
> & { experiences?: ApplicationExperienceCreateInput[] | undefined | null };

export type ApplicationExperience =
  typeof applicationExperienceTable.$inferSelect;

export type ApplicationExperienceCreateInput = Omit<
  typeof applicationExperienceTable.$inferInsert,
  "id"
>;

export type ApplicationStatus = (typeof applicationStatuses)[number];

export type ApplicationImage = typeof applicationImageTable.$inferSelect;

export type ApplicationImageCreateInput =
  | {
      type: ApplicationImageType;
      fileId: string;
    }
  | { type: ApplicationImageType; file: Blob };

import { fileMetadataTable } from "@/db/schemas";

export type File = typeof fileMetadataTable.$inferSelect;

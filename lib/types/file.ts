import { fileInfoTable } from "@/db/schemas";

export type FileInfo = typeof fileInfoTable.$inferSelect;

import { boolean, integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { fileMetadataTable } from "./file-metadata";
import { WEB_ASSET_TAGS } from "../constants/web_asset-tags";
import { timestamps } from "./base";

export const webAssetTable = pgTable("web_assets", {
  id: uuid("id")
    .references(() => fileMetadataTable.id)
    .primaryKey(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  alt: text("alt").notNull(),
  tag: text("tag", { enum: WEB_ASSET_TAGS }).array().notNull(),
  published: boolean("published").notNull().default(false),
  ...timestamps,
});

export type WebAsset = typeof webAssetTable.$inferSelect;
export type NewWebAsset = typeof webAssetTable.$inferInsert;

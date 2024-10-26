import {
  fileMetadataTable,
  showcaseImageTable,
  showcaseModelTable,
} from "@/db/schemas";
import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { showcaseLinkTable } from "./link";

export const showcaseTable = pgTable("showcases", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  coverImageId: uuid("cover_image").references(() => fileMetadataTable.id),
  description: text("description"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const showcaseRelations = relations(showcaseTable, ({ one, many }) => ({
  showcaseModels: many(showcaseModelTable),
  showcaseImages: many(showcaseImageTable),
  coverImage: one(fileMetadataTable, {
    fields: [showcaseTable.coverImageId],
    references: [fileMetadataTable.id],
  }),
  links: many(showcaseLinkTable),
}));

export type Showcase = typeof showcaseTable.$inferSelect;
export type NewShowcase = typeof showcaseTable.$inferInsert;

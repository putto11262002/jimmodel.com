import { relations } from "drizzle-orm";
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { showcaseTable } from "./showcase";

export const showcaseLinkTable = pgTable(
  "showcase_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    showcaseId: uuid("showcase_id")
      .references(() => showcaseTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    url: text("url").notNull(),
    platform: text("platform").notNull(),
    videoId: text("video_id"),
    iframeSrc: text("iframe_src").notNull(),
  },
  (table) => ({
    showcaseIndex: index("showcase_index").on(table.showcaseId),
  })
);

export const showcaseLinkRelations = relations(
  showcaseLinkTable,
  ({ one }) => ({
    showcase: one(showcaseTable, {
      fields: [showcaseLinkTable.showcaseId],
      references: [showcaseTable.id],
    }),
  })
);

export type ShowcaseLink = typeof showcaseLinkTable.$inferSelect;
export type NewShowcaseLink = typeof showcaseLinkTable.$inferInsert;

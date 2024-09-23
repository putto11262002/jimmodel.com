import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { fileMetadataTable } from "./file-metadata";
import { USER_ROLES } from "@/db/constants/user-roles";
import idTimestamp from "@/db/schemas/base";

export const userTable = pgTable("users", {
  ...idTimestamp,
  username: text("username").unique().notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(),
  email: text("email").unique().notNull(),
  roles: text("roles", { enum: USER_ROLES }).array().notNull(),
  imageId: uuid("image_id").references(() => fileMetadataTable.id),
});

export const userRelations = relations(userTable, ({ one }) => ({
  image: one(fileMetadataTable, {
    fields: [userTable.imageId],
    references: [fileMetadataTable.id],
  }),
}));

export type User = typeof userTable.$inferSelect;
export type NewUser = typeof userTable.$inferInsert;

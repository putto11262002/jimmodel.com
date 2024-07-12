import { pgEnum, timestamp, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { fileMetadataTable } from "./file-metadata";

export const userRoles = ["admin", "staff", "IT"] as const;

export const userRoleEnum = pgEnum("user_role", userRoles);

export const userTable = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar("username", { length: 8 }).unique().notNull(),
  name: varchar("name").notNull(),
  password: varchar("password").notNull(),
  email: varchar("email").unique().notNull(),
  roles: userRoleEnum("roles").array(),
  imageId: uuid("image_id").references(() => fileMetadataTable.id),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" })
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
});

export const userRelations = relations(userTable, ({ one }) => ({
  image: one(fileMetadataTable, {
    fields: [userTable.imageId],
    references: [fileMetadataTable.id],
  }),
}));

export type User = typeof userTable.$inferSelect;

export type UserWithoutSecrets = Omit<User, "password">;

export type UserCreateInput = typeof userTable.$inferInsert;

export type UserRole = (typeof userRoles)[number];

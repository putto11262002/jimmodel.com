import { pgEnum, timestamp, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

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
  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = typeof userTable.$inferSelect;

export type UserWithoutSecrets = Omit<User, "password">;

export type UserCreateInput = typeof userTable.$inferInsert;

export type UserRole = (typeof userRoles)[number];

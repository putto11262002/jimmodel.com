import db from "@/db/client";
import {
  UserCreateInput,
  UserRole,
  userTable,
  UserWithoutSecrets,
} from "@/db/schemas/users";
import ContraintViolationError from "../errors/contrain-violation-error";
import { or, eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const addUser = async (input: UserCreateInput): Promise<void> => {
  const existingUser = await db
    .select()
    .from(userTable)
    .where(
      or(
        eq(userTable.email, input.email),
        eq(userTable.username, input.username),
      ),
    )
    .limit(1);

  if (existingUser.length > 0) {
    throw new ContraintViolationError(
      "User with this email or username already exists",
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  await db.insert(userTable).values({
    username: input.username,
    email: input.email,
    name: input.name,
    password: hashedPassword,
  });
};

export const updateUserRole = async (userId: string, roles: UserRole[]) => {
  await db
    .update(userTable)
    .set({ roles: roles })
    .where(eq(userTable.id, userId))
    .returning({ updatedId: userTable.id });
};

export const findByUsernameOrEmail = async (
  usernameOrEmail: string,
): Promise<UserWithoutSecrets | null> => {
  const users = await db
    .select({
      id: userTable.id,
      username: userTable.username,
      email: userTable.email,
      name: userTable.name,
      roles: userTable.roles,
      createdAt: userTable.createdAt,
      updatedAt: userTable.updatedAt,
    })
    .from(userTable)
    .where(
      or(
        eq(userTable.email, usernameOrEmail),
        eq(userTable.username, usernameOrEmail),
      ),
    )
    .limit(1);

  if (users.length > 0) {
    return users[0];
  }

  return null;
};

export const comparePassword = async (
  userId: string,
  password: string,
): Promise<boolean> => {
  const users = await db
    .select({ password: userTable.password })
    .from(userTable)
    .where(eq(userTable.id, userId))
    .limit(1);
  if (users.length < 1) {
    return Promise.resolve(true);
  }
  const hashedPassword = users[0].password;
  return bcrypt.compare(password, hashedPassword);
};

export const resetPassword = async (
  userId: string,
  newPassword: string,
): Promise<void> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await db
    .update(userTable)
    .set({ password: hashedPassword })
    .where(eq(userTable.id, userId))
    .returning({ updatedId: userTable.id });
};

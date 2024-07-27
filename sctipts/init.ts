import { eq, or } from "drizzle-orm";
import { userTable } from "../db/schemas/users";
import db from "../db/client";
import bcrypt from "bcryptjs";

async function createRootUser() {
  const input = {
    name: process.env.ROOT_NAME || "Root",
    email: process.env.ROOT_EMAIL || "root@example/com",
    username: process.env.ROOT_USERNAME || "root",
    password: process.env.ROOT_PASSWORD || "password",
  };
  const existingUser = await db.query.userTable.findFirst({
    where: or(
      eq(userTable.email, input.email),
      eq(userTable.username, input.username),
    ),
  });

  if (existingUser) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(input.password, salt);

  await db.insert(userTable).values({
    username: input.username,
    email: input.email,
    name: input.name,
    password: hashedPassword,
    roles: ["admin"],
  });
}

async function init() {
  await createRootUser();
  console.log("Successfully pre-configure the app.");
  process.exit(0);
}

init();

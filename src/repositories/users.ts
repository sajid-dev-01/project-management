import bcrypt from "bcryptjs";
import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";
import { TableID, User } from "@/types";

export async function insertUser(data: typeof table.users.$inferInsert) {
  let password = undefined;

  if (data.password) {
    password = bcrypt.hashSync(data.password, 10);
  }

  const [res] = await db
    .insert(table.users)
    .values({ ...data, password })
    .returning();

  return res;
}

export async function insertMagicUser(email: string) {
  const [res] = await db
    .insert(table.users)
    .values({
      name: "",
      email,
      emailVerified: new Date(),
    })
    .returning();
  return res;
}

export async function findUser(userId: TableID) {
  return db.query.users.findFirst({
    where: eq(table.users.id, userId),
  });
}

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(table.users.email, email),
  });
}

export async function findMagicUserAccountByEmail(email: string) {
  return db.query.users.findFirst({
    where: eq(table.users.email, email),
  });
}

export async function updateUser(
  userId: TableID,
  data: Partial<Omit<User, "id">>
) {
  let password = undefined;

  if (data.password) {
    password = bcrypt.hashSync(data.password, 10);
  }

  return db
    .update(table.users)
    .set({ ...data, password })
    .where(eq(table.users.id, userId));
}

export async function updateUserByEmail(
  email: string,
  data: Partial<Omit<User, "id" | "email">>
) {
  let password = undefined;

  if (data.password) {
    password = bcrypt.hashSync(data.password, 10);
  }

  return db
    .update(table.users)
    .set({ ...data, password })
    .where(eq(table.users.email, email));
}

export async function deleteUser(userId: TableID) {
  return db.delete(table.users).where(eq(table.users.id, userId));
}

export async function deleteUsers(userIds: TableID[]) {
  return db.delete(table.users).where(inArray(table.users.id, userIds));
}

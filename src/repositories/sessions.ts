import { eq, inArray } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";
import { TableID } from "@/types";

export async function insertSession(data: typeof table.sessions.$inferInsert) {
  const [res] = await db.insert(table.sessions).values(data).returning();
  return res;
}

export async function findSessionById(id: TableID) {
  return db.query.sessions.findFirst({
    where: eq(table.sessions.id, id),
  });
}

export async function findSessionByUserId(userId: TableID) {
  return db.query.sessions.findFirst({
    where: eq(table.sessions.userId, userId),
  });
}

export async function updateSession(
  id: TableID,
  data: Partial<typeof table.sessions.$inferInsert>
) {
  return db.update(table.sessions).set(data).where(eq(table.sessions.id, id));
}

export async function deleteSessionByUserId(userId: TableID) {
  return db.delete(table.sessions).where(eq(table.sessions.userId, userId));
}

export async function deleteSession(id: TableID) {
  return db.delete(table.sessions).where(eq(table.sessions.id, id));
}

export async function deleteSessions(ids: TableID[]) {
  return db.delete(table.sessions).where(inArray(table.sessions.id, ids));
}

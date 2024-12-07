import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";
import { TableID } from "@/types";

export async function insertWorkspace(
  data: typeof table.workspaces.$inferInsert
) {
  const [res] = await db.insert(table.workspaces).values(data).returning();

  return res;
}

export async function findWorkspaceById(id: TableID) {
  return db.query.workspaces.findFirst({
    where: eq(table.workspaces.id, id),
  });
}

export async function findWorkspacesByUserId(userId: TableID) {
  return db.query.workspaces.findMany({
    where: eq(table.workspaces.userId, userId),
  });
}

export async function updateWorkspace(
  id: string,
  data: Partial<typeof table.workspaces.$inferInsert>
) {
  const [res] = await db
    .update(table.workspaces)
    .set(data)
    .where(eq(table.workspaces.id, id))
    .returning();

  return res;
}

export async function deleteWorkspace(id: TableID) {
  return db.delete(table.workspaces).where(eq(table.workspaces.id, id));
}

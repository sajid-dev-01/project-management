import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";
import { TableID } from "@/types";

export async function insertProject(data: typeof table.projects.$inferInsert) {
  const [res] = await db.insert(table.projects).values(data).returning();

  return res;
}

export async function findProjectById(id: TableID) {
  return db.query.projects.findFirst({
    where: eq(table.projects.id, id),
  });
}

export async function findProjectsByWorkspaceId(workspaceId: TableID) {
  return db.query.projects.findMany({
    where: eq(table.projects.workspaceId, workspaceId),
  });
}

export async function updateProject(
  id: TableID,
  data: Partial<typeof table.projects.$inferInsert>
) {
  return db.update(table.projects).set(data).where(eq(table.projects.id, id));
}

export async function deleteProject(id: TableID) {
  return db.delete(table.projects).where(eq(table.projects.id, id));
}

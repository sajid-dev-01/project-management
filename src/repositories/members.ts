import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";
import { TableID } from "@/types";

export async function insertMember(data: typeof table.members.$inferInsert) {
  const [res] = await db.insert(table.members).values(data).returning();
  return res;
}

export async function findMember({
  userId,
  workspaceId,
}: {
  userId: TableID;
  workspaceId: TableID;
}) {
  return db.query.members.findFirst({
    where: and(
      eq(table.members.workspaceId, workspaceId),
      eq(table.members.userId, userId)
    ),
  });
}

export async function findMembersByWorkspaceId(workspaceId: TableID) {
  return db
    .select({
      id: table.users.id,
      name: table.users.name,
      email: table.users.email,
      image: table.users.image,
      role: table.members.role,
    })
    .from(table.users)
    .innerJoin(table.members, eq(table.members.userId, table.users.id))
    .innerJoin(
      table.workspaces,
      eq(table.workspaces.id, table.members.workspaceId)
    )
    .where(eq(table.workspaces.id, workspaceId));
}

export async function updateMember(
  userId: TableID,
  data: Partial<typeof table.members.$inferInsert>
) {
  return db
    .update(table.members)
    .set(data)
    .where(eq(table.members.userId, userId));
}

export async function deleteMemberByUserId(userId: TableID) {
  return db.delete(table.members).where(eq(table.members.userId, userId));
}

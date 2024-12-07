import { and, desc, eq, gte, inArray, like, lt, lte, not } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";
import { TaskQueryDto } from "@/features/tasks/schemas";
import { TableID } from "@/types";

export async function insertTask(data: typeof table.tasks.$inferInsert) {
  const [res] = await db.insert(table.tasks).values(data).returning();

  return res;
}

export async function findHighestPositionTask(workspaceId: TableID) {
  return db.query.tasks.findFirst({
    where: eq(table.tasks.workspaceId, workspaceId),
    orderBy: desc(table.tasks.position),
  });
}

export async function findTaskById(id: TableID) {
  return db.query.tasks.findFirst({
    columns: {
      projectId: false,
      assigneeId: false,
    },
    with: {
      project: true,
      assignee: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    where: eq(table.tasks.id, id),
  });
}

export async function findTaskByIds(ids: TableID[]) {
  return db.query.tasks.findMany({
    where: inArray(table.tasks.id, ids),
  });
}

export async function findTasksByProjectId(porjectId: TableID) {
  return db.query.tasks.findMany({
    where: eq(table.tasks.projectId, porjectId),
  });
}

export async function updateTask(
  id: string,
  data: Partial<typeof table.tasks.$inferInsert>
) {
  return db.update(table.tasks).set(data).where(eq(table.tasks.id, id));
}

export async function deleteTask(id: TableID) {
  return db.delete(table.tasks).where(eq(table.tasks.id, id));
}

export async function searchTasks(
  query: TaskQueryDto & {
    statusNot?: table.TaskStatus;
    dateFrom?: Date;
    dateTo?: Date;
  }
) {
  const {
    workspaceId,
    projectId,
    search,
    assigneeId,
    status,
    statusNot,
    dateFrom,
    dateTo,
    dueDate,
  } = query;

  return db.query.tasks.findMany({
    columns: {
      projectId: false,
      assigneeId: false,
    },
    with: {
      project: true,
      assignee: {
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    where: and(
      workspaceId ? eq(table.tasks.workspaceId, workspaceId) : undefined,
      projectId ? eq(table.tasks.projectId, projectId) : undefined,
      assigneeId ? eq(table.tasks.assigneeId, assigneeId) : undefined,
      status ? eq(table.tasks.status, status) : undefined,
      statusNot ? not(eq(table.tasks.status, statusNot)) : undefined,
      dueDate ? lt(table.tasks.dueDate, dueDate) : undefined,
      dateFrom ? gte(table.tasks.createdAt, dateFrom) : undefined,
      dateTo ? lte(table.tasks.createdAt, dateTo) : undefined,
      search ? like(table.tasks.name, `%${search}%`) : undefined
    ),
    orderBy: desc(table.tasks.id),
  });
}

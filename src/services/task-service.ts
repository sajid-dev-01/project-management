import "server-only";

import {
  BulkTaskUpdateDto,
  CreateTaskDto,
  TaskQueryDto,
} from "@/features/tasks/schemas";
import { ApplicationError, NotFoundError } from "@/lib/errors";
import {
  deleteTask,
  findHighestPositionTask,
  findTaskById,
  findTaskByIds,
  insertTask,
  searchTasks,
  updateTask,
} from "@/repositories/tasks";
import { TableID } from "@/types";

import { isWorkspaceMember } from "./workspace-service";

export const createTask = async (userId: TableID, dto: CreateTaskDto) => {
  if (!(await isWorkspaceMember({ userId, workspaceId: dto.workspaceId }))) {
    throw new NotFoundError();
  }

  const highestPositionTask = await findHighestPositionTask(dto.workspaceId);
  const position = highestPositionTask ? highestPositionTask.position + 1 : 1;

  return await insertTask({ ...dto, position });
};

export const getTaskById = async ({
  userId,
  taskId,
}: {
  userId: TableID;
  taskId: TableID;
}) => {
  const task = await findTaskById(taskId);
  if (!task) throw new NotFoundError();

  if (!(await isWorkspaceMember({ userId, workspaceId: task.workspaceId }))) {
    throw new NotFoundError();
  }

  return task;
};

export const getAllTaskOfWorkspace = async (
  userId: TableID,
  filters: TaskQueryDto
) => {
  if (
    filters.workspaceId &&
    !(await isWorkspaceMember({ userId, workspaceId: filters.workspaceId }))
  ) {
    throw new NotFoundError();
  }

  return await searchTasks(filters);
};

export const updateTaskById = async (
  taskId: TableID,
  dto: Partial<CreateTaskDto>
) => {
  const task = await findTaskById(taskId);
  if (!task) throw new NotFoundError();

  if (
    !(await isWorkspaceMember({
      userId: task.assignee.id,
      workspaceId: task.workspaceId,
    }))
  ) {
    throw new NotFoundError();
  }

  return await updateTask(taskId, dto);
};

export const bulkTasksUpdate = async (
  userId: TableID,
  dtos: BulkTaskUpdateDto["tasks"]
) => {
  const taskToUpdate = await findTaskByIds(dtos.map((i) => i.id));

  const workspaceIds = new Set(taskToUpdate.map((t) => t.workspaceId));
  if (workspaceIds.size !== 1) {
    return new ApplicationError("All tasks must belong to the same workspace");
  }
  const workspaceId = workspaceIds.values().next().value!;

  if (!(await isWorkspaceMember({ userId, workspaceId }))) {
    throw new NotFoundError();
  }

  return await Promise.all(
    dtos.map(({ id, status, position }) => updateTask(id, { status, position }))
  );
};

export const deleteUserTask = async ({
  userId,
  taskId,
}: {
  userId: TableID;
  taskId: TableID;
}) => {
  // check if task related to user or throw
  await getTaskById({ userId, taskId });
  return await deleteTask(taskId);
};

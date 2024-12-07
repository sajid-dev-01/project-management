import "server-only";

import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import {
  CreateProjectDto,
  UpdateProjectDto,
} from "@/features/projects/schemas";
import { NotFoundError } from "@/lib/errors";
import {
  deleteProject,
  findProjectById,
  findProjectsByWorkspaceId,
  insertProject,
  updateProject,
} from "@/repositories/projects";
import { searchTasks } from "@/repositories/tasks";
import { TableID } from "@/types";

import { isWorkspaceMember } from "./workspace-service";

export const createProject = async (userId: TableID, dto: CreateProjectDto) => {
  if (!(await isWorkspaceMember({ userId, workspaceId: dto.workspaceId }))) {
    throw new NotFoundError();
  }
  return await insertProject(dto);
};

export const getProjectById = async ({
  userId,
  projectId,
}: {
  userId: TableID;
  projectId: TableID;
}) => {
  const project = await findProjectById(projectId);
  if (!project) throw new NotFoundError();

  if (
    !(await isWorkspaceMember({ userId, workspaceId: project.workspaceId }))
  ) {
    throw new NotFoundError();
  }

  return project;
};

export const getAllProjectOfWorkspace = async ({
  userId,
  workspaceId,
}: {
  userId: TableID;
  workspaceId: TableID;
}) => {
  if (!(await isWorkspaceMember({ userId, workspaceId })))
    throw new NotFoundError();

  return await findProjectsByWorkspaceId(workspaceId);
};

export const updateUserProject = async ({
  userId,
  projectId,
  data,
}: {
  userId: TableID;
  projectId: TableID;
  data: UpdateProjectDto;
}) => {
  // check if project related to user or throw not found error
  await getProjectById({ userId, projectId });
  return await updateProject(projectId, data);
};

export const deleteUserProject = async ({
  userId,
  projectId,
}: {
  userId: TableID;
  projectId: TableID;
}) => {
  // check if project related to user or throw not found error
  await getProjectById({ userId, projectId });
  return await deleteProject(projectId);
};

export const getProjectAnalytics = async ({
  userId,
  projectId,
}: {
  userId: TableID;
  projectId: TableID;
}) => {
  const project = await findProjectById(projectId);
  if (!project) throw new NotFoundError();

  const workspaceId = project.workspaceId;
  if (!(await isWorkspaceMember({ userId, workspaceId }))) {
    throw new NotFoundError();
  }

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTasks = await searchTasks({
    projectId,
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthTasks = await searchTasks({
    projectId,
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const taskCount = thisMonthTasks.length;
  const taskDifference = taskCount - lastMonthTasks.length;

  const thisMonthAssignedTasks = await searchTasks({
    projectId,
    assigneeId: userId,
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthAssignedTasks = await searchTasks({
    projectId,
    assigneeId: userId,
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const assignedTaskCount = thisMonthAssignedTasks.length;
  const assignedTaskDifference =
    assignedTaskCount - lastMonthAssignedTasks.length;

  const thisMonthCompleteTasks = await searchTasks({
    projectId,
    status: "DONE",
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthCompleteTasks = await searchTasks({
    projectId,
    status: "DONE",
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const completeTaskCount = thisMonthCompleteTasks.length;
  const completeTaskDifference =
    completeTaskCount - lastMonthCompleteTasks.length;

  const thisMonthIncompleteTasks = await searchTasks({
    projectId,
    statusNot: "DONE",
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthIncompleteTasks = await searchTasks({
    projectId,
    statusNot: "DONE",
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const incompleteTaskCount = thisMonthIncompleteTasks.length;
  const incompleteTaskDifference =
    incompleteTaskCount - lastMonthIncompleteTasks.length;

  const thisMonthOverdueTasks = await searchTasks({
    projectId,
    statusNot: "DONE",
    dueDate: now,
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthOverdueTasks = await searchTasks({
    projectId,
    statusNot: "DONE",
    dueDate: now,
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const overdueTaskCount = thisMonthOverdueTasks.length;
  const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.length;

  return {
    taskCount,
    taskDifference,
    assignedTaskCount,
    assignedTaskDifference,
    completeTaskCount,
    completeTaskDifference,
    incompleteTaskCount,
    incompleteTaskDifference,
    overdueTaskCount,
    overdueTaskDifference,
  };
};

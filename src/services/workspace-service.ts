import "server-only";

import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { CreateWorkspaceDto } from "@/features/workspaces/schemas";
import { ApplicationError, NotFoundError } from "@/lib/errors";
import { generateInvitationCode } from "@/lib/helpers";
import {
  findMember,
  findMembersByWorkspaceId,
  insertMember,
} from "@/repositories/members";
import { searchTasks } from "@/repositories/tasks";
import {
  deleteWorkspace,
  findWorkspaceById,
  findWorkspacesByUserId,
  insertWorkspace,
  updateWorkspace,
} from "@/repositories/workspaces";
import { TableID } from "@/types";

export const isWorkspaceMember = async (query: {
  userId: TableID;
  workspaceId: TableID;
}) => {
  const workspace = await getUserWorkspace(query);
  if (workspace) return true;

  const res = await findMember(query);
  if (res) return true;

  return false;
};

export const createWorkspace = async ({
  name,
  image,
  userId,
}: CreateWorkspaceDto & { userId: TableID }) => {
  return await insertWorkspace({
    name,
    image,
    userId,
    inviteCode: generateInvitationCode(8),
  });
};

export const getUserWorkspace = async (query: {
  userId: TableID;
  workspaceId: TableID;
}) => {
  const workspace = await findWorkspaceById(query.workspaceId);
  if (!workspace || workspace.userId !== query.userId) return null;

  return workspace;
};

export const getWorkspaceAnalytics = async (query: {
  userId: TableID;
  workspaceId: TableID;
}) => {
  if (!(await isWorkspaceMember(query))) throw new NotFoundError();

  const { userId, workspaceId } = query;

  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTasks = await searchTasks({
    workspaceId,
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthTasks = await searchTasks({
    workspaceId,
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const taskCount = thisMonthTasks.length;
  const taskDifference = taskCount - lastMonthTasks.length;

  const thisMonthAssignedTasks = await searchTasks({
    workspaceId,
    assigneeId: userId,
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthAssignedTasks = await searchTasks({
    workspaceId,
    assigneeId: userId,
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const assignedTaskCount = thisMonthAssignedTasks.length;
  const assignedTaskDifference =
    assignedTaskCount - lastMonthAssignedTasks.length;

  const thisMonthCompleteTasks = await searchTasks({
    workspaceId,
    status: "DONE",
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthCompleteTasks = await searchTasks({
    workspaceId,
    status: "DONE",
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const completeTaskCount = thisMonthCompleteTasks.length;
  const completeTaskDifference =
    completeTaskCount - lastMonthCompleteTasks.length;

  const thisMonthIncompleteTasks = await searchTasks({
    workspaceId,
    statusNot: "DONE",
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthIncompleteTasks = await searchTasks({
    workspaceId,
    statusNot: "DONE",
    dateFrom: lastMonthStart,
    dateTo: lastMonthEnd,
  });
  const incompleteTaskCount = thisMonthIncompleteTasks.length;
  const incompleteTaskDifference =
    incompleteTaskCount - lastMonthIncompleteTasks.length;

  const thisMonthOverdueTasks = await searchTasks({
    workspaceId,
    statusNot: "DONE",
    dueDate: now,
    dateFrom: thisMonthStart,
    dateTo: thisMonthEnd,
  });
  const lastMonthOverdueTasks = await searchTasks({
    workspaceId,
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

export const getUserWorkspaces = async (userId: TableID) => {
  return await findWorkspacesByUserId(userId);
};

export const updateUserWorkspace = async ({
  name,
  image,
  workspaceId,
  userId,
}: CreateWorkspaceDto & { workspaceId: TableID; userId: TableID }) => {
  const workspace = await getUserWorkspace({ userId, workspaceId });
  if (!workspace) throw new NotFoundError();

  await updateWorkspace(workspaceId, { name, image });

  return workspace;
};

export const removeUserWorkspace = async ({
  userId,
  workspaceId,
}: {
  userId: TableID;
  workspaceId: TableID;
}) => {
  const workspace = await getUserWorkspace({ userId, workspaceId });
  if (!workspace) throw new NotFoundError();

  return await deleteWorkspace(workspaceId);
};

export const resetWorkspaceInviteCode = async ({
  userId,
  workspaceId,
}: {
  userId: TableID;
  workspaceId: TableID;
}) => {
  const workspace = await getUserWorkspace({ userId, workspaceId });
  if (!workspace) throw new NotFoundError();

  return await updateWorkspace(workspaceId, {
    inviteCode: generateInvitationCode(8),
  });
};

export const joinWorkspace = async ({
  userId,
  workspaceId,
  code,
}: {
  userId: TableID;
  workspaceId: TableID;
  code: string;
}) => {
  if (!(await isWorkspaceMember({ userId, workspaceId }))) {
    throw new ApplicationError("Already a member");
  }

  const workspace = await findWorkspaceById(workspaceId);
  if (!workspace) throw new NotFoundError();

  if (workspace.inviteCode !== code) {
    throw new ApplicationError("Invalid code");
  }

  await insertMember({ userId, workspaceId, role: "MEMBER" });

  return workspace;
};

export const getWorkspaceMembers = async ({
  userId,
  workspaceId,
}: {
  userId: TableID;
  workspaceId: TableID;
}) => {
  if (!(await isWorkspaceMember({ userId, workspaceId }))) {
    throw new NotFoundError();
  }

  return await findMembersByWorkspaceId(workspaceId);
};

import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { queryClient } from "@/lib/query-client";
import { client } from "@/lib/rpc";
import { TableID } from "@/types";

import { TaskQueryDto } from "./schemas";
import { PopulatedTask } from "./types";

export const useTask = (taskId: TableID) => {
  return useQuery<PopulatedTask>({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await client.api.tasks[":taskId"].$get({ param: { taskId } });
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return {
        ...data,
        dueDate: new Date(data.dueDate),
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    },
  });
};

export const useTasks = (query: TaskQueryDto) => {
  return useQuery<PopulatedTask[]>({
    queryKey: ["tasks", query],
    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: {
          workspaceId: query.workspaceId ?? undefined,
          projectId: query.projectId ?? undefined,
          status: query.status ?? undefined,
          assigneeId: query.assigneeId ?? undefined,
          dueDate: query.dueDate?.toISOString() ?? undefined,
        },
      });
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return data.map((i) => ({
        ...i,
        dueDate: new Date(i.dueDate),
        createdAt: new Date(i.createdAt),
        updatedAt: new Date(i.updatedAt),
      }));
    },
  });
};

export const useCreateTask = () => {
  return useMutation<
    InferResponseType<typeof client.api.tasks.$post>,
    Error,
    InferRequestType<typeof client.api.tasks.$post>
  >({
    mutationFn: async ({ json }) => {
      const res = await client.api.tasks.$post({ json });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task created");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
  });
};

export const useUpdateTask = () => {
  return useMutation<
    InferResponseType<(typeof client.api.tasks)[":taskId"]["$patch"]>,
    Error,
    InferRequestType<(typeof client.api.tasks)[":taskId"]["$patch"]>
  >({
    mutationFn: async ({ param, json }) => {
      const res = await client.api.tasks[":taskId"].$patch({ json, param });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
  });
};

export const useBulkUpdateTask = () => {
  return useMutation<
    InferResponseType<(typeof client.api.tasks)["bulk-update"]["$post"]>,
    Error,
    InferRequestType<(typeof client.api.tasks)["bulk-update"]["$post"]>
  >({
    mutationFn: async ({ json }) => {
      const res = await client.api.tasks["bulk-update"]["$post"]({ json });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: () => {
      toast.success("Tasks updated");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Failed to update tasks");
    },
  });
};

export const useDeleteTask = () => {
  return useMutation<
    InferResponseType<(typeof client.api.tasks)[":taskId"]["$delete"]>,
    Error,
    InferRequestType<(typeof client.api.tasks)[":taskId"]["$delete"]>
  >({
    mutationFn: async ({ param }) => {
      const res = await client.api.tasks[":taskId"].$delete({ param });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted");
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
  });
};

import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { queryClient } from "@/lib/query-client";
import { client } from "@/lib/rpc";
import { Project, TableID } from "@/types";

export const useCreateProject = () => {
  return useMutation<
    InferResponseType<typeof client.api.projects.$post>,
    Error,
    InferRequestType<typeof client.api.projects.$post>
  >({
    mutationFn: async ({ json }) => {
      const res = await client.api.projects.$post({ json });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: () => {
      toast.success("Project created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
};

export const useUpdateProject = () => {
  return useMutation<
    InferResponseType<
      (typeof client.api.projects)[":projectId"]["$patch"],
      200
    >,
    Error,
    InferRequestType<(typeof client.api.projects)[":projectId"]["$patch"]>
  >({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.projects[":projectId"]["$patch"]({
        json,
        param,
      });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.id] });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
};

export const useProjects = (workspaceId: TableID) => {
  return useQuery<Project[]>({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const res = await client.api.projects.$get({
        query: { workspaceId },
      });
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return data;
    },
  });
};

export const useProjectAnalytics = (projectId: TableID) => {
  return useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      const res = await client.api.projects[":projectId"].analytics.$get({
        param: { projectId },
      });
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return data;
    },
  });
};

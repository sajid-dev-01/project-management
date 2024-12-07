import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { queryClient } from "@/lib/query-client";
import { client } from "@/lib/rpc";
import { TableID, Workspace } from "@/types";

export const useCreateWorkspace = () => {
  return useMutation<
    any,
    Error,
    InferRequestType<typeof client.api.workspaces.$post>
  >({
    mutationFn: async ({ json }) => {
      const res = await client.api.workspaces.$post({ json });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: () => {
      toast.success("Workspace created");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => toast.error("Failed to create workspace"),
  });
};

export const useUpdateWorkspace = () => {
  return useMutation<
    InferResponseType<(typeof client.api.workspaces)[":workspaceId"]["$patch"]>,
    Error,
    InferRequestType<(typeof client.api.workspaces)[":workspaceId"]["$patch"]>
  >({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.workspaces[":workspaceId"]["$patch"]({
        json,
        param,
      });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });
};

export const useWorkspaces = () => {
  return useQuery<Workspace[]>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const res = await client.api.workspaces.$get();
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return data.map((i) => ({
        ...i,
        createdAt: new Date(i.createdAt),
        updatedAt: new Date(i.updatedAt),
      }));
    },
  });
};

export const useWorkspaceInfo = (workspaceId: TableID) => {
  return useQuery<Pick<Workspace, "id" | "name" | "image">>({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"].info.$get({
        param: { workspaceId },
      });
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return data;
    },
  });
};

export const useWorkspaceAnalytics = (workspaceId: TableID) => {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"].analytics.$get({
        param: { workspaceId },
      });
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return data;
    },
  });
};

export const useDeleteWorkspace = () => {
  return useMutation<
    InferResponseType<
      (typeof client.api.workspaces)[":workspaceId"]["$delete"]
    >,
    Error,
    InferRequestType<(typeof client.api.workspaces)[":workspaceId"]["$delete"]>
  >({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"].$delete({
        param,
      });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace deleted");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: () => toast.error("Failed to delete workspace"),
  });
};

export const useResetInviteCode = () => {
  return useMutation<
    InferResponseType<
      (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
    >,
    Error,
    InferRequestType<
      (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
    >
  >({
    mutationFn: async ({ param }) => {
      const res = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ].$post({
        param,
      });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.id] });
    },
    onError: () => toast.error("Failed to reset invite code"),
  });
};

export const useJoinWorkspace = () => {
  return useMutation<
    InferResponseType<
      (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
    >,
    Error,
    InferRequestType<
      (typeof client.api.workspaces)[":workspaceId"]["join"]["$post"]
    >
  >({
    mutationFn: async ({ json, param }) => {
      const res = await client.api.workspaces[":workspaceId"].join.$post({
        json,
        param,
      });
      if (!res.ok) throw await res.json();

      return res.json();
    },
    onSuccess: () => {
      toast.success("Joined Workspace");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: () => toast.error("Failed to join workspace"),
  });
};

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"].members.$get({
        param: { workspaceId },
      });
      if (!res.ok) throw await res.json();

      const { data } = await res.json();
      return data;
    },
  });
};

"use client";

import { useWorkspaceInfo } from "@/features/workspaces/api";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const WorkspaceIdJoinClient = () => {
  const workspaceId = useWorkspaceId();

  const { data, isLoading } = useWorkspaceInfo(workspaceId);

  if (isLoading) {
    return "Loading...";
  }

  if (!data) {
    return "Workspace not found";
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm inviteValues={data} />
    </div>
  );
};

export default WorkspaceIdJoinClient;

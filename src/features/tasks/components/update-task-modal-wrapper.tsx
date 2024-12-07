"use client";

import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useProjects } from "@/features/projects/api";
import { useTask } from "@/features/tasks/api";
import { useWorkspaceMembers } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { TableID } from "@/types";

import { UpdateTaskForm } from "./update-task-form";

interface Props {
  onCancel: () => void;
  taskId: TableID;
}

export const UpdateTaskWrapper = ({ onCancel, taskId }: Props) => {
  const workspaceId = useWorkspaceId();

  const { data: task, isPending: isLoadingTask } = useTask(taskId);
  const { data: projects, isPending: isLoadingProjects } =
    useProjects(workspaceId);
  const { data: members, isPending: isLoadingMembers } =
    useWorkspaceMembers(workspaceId);

  const projectOptions = projects?.map((project) => ({
    id: project.id,
    name: project.name,
    image: project.image,
  }));
  const memberOptions = members?.map((member) => ({
    id: member.id,
    name: member.name,
    image: member.image,
  }));

  const isLoading = isLoadingTask || isLoadingMembers || isLoadingProjects;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="text-muted-foreground size-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!task) return null;

  return (
    <UpdateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []}
      initialTask={task}
    />
  );
};

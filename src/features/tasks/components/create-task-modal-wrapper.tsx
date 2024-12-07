"use client";

import { Loader } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useProjects } from "@/features/projects/api";
import { useWorkspaceMembers } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { CreateTaskForm } from "./create-task-form";

interface CreateTaskWrapperProps {
  onCancel: () => void;
}

export const CreateTaskWrapper = ({ onCancel }: CreateTaskWrapperProps) => {
  const workspaceId = useWorkspaceId();

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

  const isLoading = isLoadingMembers || isLoadingProjects;

  if (isLoading) {
    return (
      <Card className="h-[714px] w-full border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="text-muted-foreground size-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="">
      <CreateTaskForm
        onCancel={onCancel}
        projectOptions={projectOptions ?? []}
        memberOptions={memberOptions ?? []}
      />
    </div>
  );
};

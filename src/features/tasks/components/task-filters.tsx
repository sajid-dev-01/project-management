"use client";

import { FolderIcon, ListCheckIcon, UserIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/ui-extension/datetime-picker";
import { TASK_STATUS, TaskStatus } from "@/db/schema";
import { useProjects } from "@/features/projects/api";
import { useWorkspaceMembers } from "@/features/workspaces/api";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useTaskFilters } from "../hooks/use-task-filters";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const TaskFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isLoadingProjects } =
    useProjects(workspaceId);
  const { data: members, isLoading: isLoadingMembers } =
    useWorkspaceMembers(workspaceId);
  const isLoading = isLoadingMembers || isLoadingProjects;

  const projectOptions = projects?.map((project) => ({
    value: project.id,
    label: project.name,
  }));
  const memberOptions = members?.map((member) => ({
    value: member.id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTaskFilters();

  const onStatusChange = (value: string) =>
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  const onAssigneeChange = (value: string) =>
    setFilters({ assigneeId: value === "all" ? null : (value as string) });
  const onProjectChange = (value: string) =>
    setFilters({ projectId: value === "all" ? null : (value as string) });

  if (isLoading) return null;
  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="mr-2 size-4" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TASK_STATUS.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TASK_STATUS.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TASK_STATUS.IN_REVIEW}>In Review</SelectItem>
          <SelectItem value={TASK_STATUS.TODO}>Todo</SelectItem>
          <SelectItem value={TASK_STATUS.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={(value) => onAssigneeChange(value)}
      >
        <SelectTrigger className="h-8 w-full lg:w-auto">
          <div className="flex items-center pr-2">
            <UserIcon className="mr-2 size-4" />
            <SelectValue placeholder="All assignee" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!hideProjectFilter && (
        <Select
          defaultValue={projectId ?? undefined}
          onValueChange={(value) => onProjectChange(value)}
        >
          <SelectTrigger className="h-8 w-full lg:w-auto">
            <div className="flex items-center pr-2">
              <FolderIcon className="mr-2 size-4" />
              <SelectValue placeholder="All projects" />
            </div>
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All projects</SelectItem>
            <SelectSeparator />
            {projectOptions?.map((project) => (
              <SelectItem key={project.value} value={project.value}>
                {project.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <DateTimePicker
        placeholder="Due Date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date : null });
        }}
      />
    </div>
  );
};

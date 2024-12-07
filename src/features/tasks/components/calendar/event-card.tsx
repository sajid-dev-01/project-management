import { useRouter } from "next/navigation";
import React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TASK_STATUS, TaskStatus } from "@/db/schema";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import { Project, User } from "@/types";

interface EventCardProps {
  title: string;
  assignee: Pick<User, "id" | "name">;
  project: Project;
  status: TaskStatus;
  id: string;
}

const statusColorMap: Record<TaskStatus, string> = {
  [TASK_STATUS.BACKLOG]: "border-l-pink-500",
  [TASK_STATUS.TODO]: "border-l-red-500",
  [TASK_STATUS.IN_PROGRESS]: "border-l-yellow-500",
  [TASK_STATUS.IN_REVIEW]: "border-l-blue-500",
  [TASK_STATUS.DONE]: "border-l-emerald-500",
};

export const EventCard = ({
  assignee,
  id,
  project,
  status,
  title,
}: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={onClick}
        className={cn(
          "text-primary flex cursor-pointer flex-col gap-y-1.5 rounded-md border border-l-4 bg-white p-1.5 text-xs transition hover:opacity-75",
          statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1">
          <Avatar className="size-5 rounded-full border border-neutral-300 transition">
            <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
              {assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="size-1 rounded-full bg-neutral-300" />
          <Avatar className="size-5 rounded-full border border-neutral-300 transition">
            <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
              {project?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

import { ChevronRightIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/components/ui-extension/alert";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useDeleteTask } from "../api";
import { PopulatedTask } from "../types";

interface Props {
  task: PopulatedTask;
}

export const TaskBreadcrumbs = ({ task }: Props) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useDeleteTask();

  const confirm = useConfirm();

  const handleDeleteTask = async () => {
    const ok = await confirm({ title: "Delete task" });
    if (!ok) return;

    mutate(
      { param: { taskId: task.id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-6 rounded-full border border-neutral-300 transition">
        <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
          {task.project.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <Link
        href={`/workspaces/${workspaceId}/projects/${task.project.id}?projectId=${task.project.id}`}
      >
        <p className="text-muted-foreground text-sm font-semibold transition hover:opacity-75 lg:text-lg">
          {task.project.name}
        </p>
      </Link>
      <ChevronRightIcon className="text-muted-foreground size-4 lg:size-5" />

      <p className="text-sm font-semibold lg:text-lg">{task.name}</p>
      <Button
        className="ml-auto"
        variant={"destructive"}
        size={"sm"}
        onClick={handleDeleteTask}
        disabled={isPending}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

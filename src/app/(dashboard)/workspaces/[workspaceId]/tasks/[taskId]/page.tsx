"use client";

import { useParams } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { useTask } from "@/features/tasks/api";
import { TaskBreadcrumbs } from "@/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/features/tasks/components/task-desc";
import { TaskOverview } from "@/features/tasks/components/task-overview";

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { data, isLoading } = useTask(taskId);

  if (isLoading) {
    return "Loading...";
  }

  if (!data) {
    return "Task not found";
  }

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs task={data} />
      <Separator className="my-6" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
}

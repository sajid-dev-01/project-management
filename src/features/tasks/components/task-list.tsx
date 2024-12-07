"use client";

import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui-extension/dotted-separetor";

import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { PopulatedTask } from "../types";

interface TaskListProps {
  workspaceId: string;
  tasks: PopulatedTask[];
  total: number;
}

export const TaskList = ({ workspaceId, tasks, total }: TaskListProps) => {
  const { open: opneCreateModal } = useCreateTaskModal();
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="mb-2 flex items-center justify-between">
            <p className="text-lg font-semibold">Tasks ({total})</p>
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={() => opneCreateModal()}
            >
              <PlusIcon className="size-4 text-neutral-400" />
            </Button>
          </CardTitle>
          <DottedSeparator className="my-4" />
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-y-4">
            {tasks.map((task) => (
              <li key={task.id}>
                <Link href={`/workspaces/${workspaceId}/tasks/${task.id}`}>
                  <Card className="rounded-lg shadow-none transition hover:opacity-75">
                    <CardContent className="p-4">
                      <p className="truncate text-lg font-medium">
                        {task.name}
                      </p>
                      <div className="flex items-center gap-x-2">
                        <p>{task.project?.name}</p>
                        <div className="size-1 rounded-full bg-neutral-300" />
                        <div className="text-muted-foreground flex items-center text-sm">
                          <CalendarIcon className="mr-1 size-3" />
                          <span className="truncate">
                            {formatDistanceToNow(new Date(task.dueDate))}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
            <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
              No Tasks Fount
            </li>
          </ul>
          <Button variant={"outline"} className="mt-4 w-full" asChild>
            <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

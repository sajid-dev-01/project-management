import { PencilIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { snakeCaseToTitleCase } from "@/lib/helpers";

import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { PopulatedTask } from "../types";
import { TaskDate } from "./task-date";

interface OverviewPropertyProps {
  label: string;
  children: React.ReactNode;
}

const OverviewProperty = ({ children, label }: OverviewPropertyProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <div className="min-w-[100px]">
        <p className="text-muted-foreground text-sm">{label}</p>
      </div>
      <div className="flex items-center gap-x-2">{children}</div>
    </div>
  );
};

interface Props {
  task: PopulatedTask;
}

export const TaskOverview = ({ task }: Props) => {
  const { setUpdateTaskId: openUpdateModal } = useUpdateTaskModal();
  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={() => openUpdateModal(task.id)}
          >
            <PencilIcon className="mr-2 size-4" />
            Edit
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <Avatar className="size-6 rounded-full border border-neutral-300 transition">
              <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
                {task.assignee.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

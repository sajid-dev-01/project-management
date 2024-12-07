import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVertical, MoreHorizontalIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { PopulatedTask } from "../../types";
import { TaskActions } from "../task-actions";
import { TaskDate } from "../task-date";

interface TaskCardProps {
  task: PopulatedTask;
  isOverlay?: boolean;
}

export interface TaskDragData {
  type: "Task";
  task: PopulatedTask;
}

export const KanbanCard = ({ task, isOverlay }: TaskCardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("rounded-md", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <div className="bg-background space-y-2 rounded-md p-3 text-xs">
        <div
          className="flex cursor-grab items-center justify-between gap-2"
          {...attributes}
          {...listeners}
        >
          <p className="text-base font-semibold">{task.name}</p>
          <TaskActions id={task.id} projectId={task.project.id}>
            <Button size={"icon"} variant={"ghost"} className="size-6">
              <MoreHorizontalIcon />
            </Button>
          </TaskActions>
        </div>
        <TaskDate value={task.dueDate} />
        <p className="text-sm font-medium">{task.project.name}</p>
        <p className="text-muted-foreground line-clamp-4">
          {task.desc || "Lorem ipsum dollor sit emmit."}
        </p>
        <Separator />
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarFallback className="">
              {task.assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p>Assigned to {task.assignee.name}</p>
        </div>
      </div>
    </div>
  );
};

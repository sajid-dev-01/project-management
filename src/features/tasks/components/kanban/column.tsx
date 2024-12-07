import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { GripVerticalIcon, PlusIcon } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heading } from "@/components/ui-extension/heading";
import { TaskStatus } from "@/db/schema";
import { snakeCaseToTitleCase } from "@/lib/helpers";

import { useCreateTaskModal } from "../../hooks/use-create-task-modal";
import { PopulatedTask } from "../../types";
import { KanbanCard } from "./card";

export interface ColumnDragData {
  type: "Column";
  column: TaskStatus;
}

interface Props {
  column: TaskStatus;
  tasks: PopulatedTask[];
  isOverlay?: boolean;
}

export const BoardColumn = ({ column, tasks, isOverlay }: Props) => {
  const { open: openTaskModal } = useCreateTaskModal();
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${snakeCaseToTitleCase(column)}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "min-h-[500px] h-[600px] w-[350px] max-w-full rounded-md bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-2">
        <div className="inline-flex items-center justify-between">
          <div className="inline-flex items-center gap-2">
            <Button
              size={"icon"}
              variant={"ghost"}
              className="size-8 cursor-grab"
              {...attributes}
              {...listeners}
            >
              <span className="sr-only">Move column {column}</span>
              <GripVerticalIcon />
            </Button>
            <Heading tag="h6">{snakeCaseToTitleCase(column)}</Heading>
            <Badge variant={"secondary"}>{tasks.length}</Badge>
          </div>
          <Button
            variant={"secondary"}
            className="size-8"
            onClick={() => openTaskModal(column)}
          >
            <PlusIcon />
          </Button>
        </div>
      </CardHeader>
      <ScrollArea>
        <CardContent className="space-y-4 p-2">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

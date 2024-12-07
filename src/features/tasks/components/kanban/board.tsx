import {
  Active,
  DataRef,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  Over,
  TouchSensor,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { TASK_STATUS, TaskStatus } from "@/db/schema";

import { PopulatedTask } from "../../types";
import { KanbanCard, TaskDragData } from "./card";
import { BoardColumn, ColumnDragData } from "./column";

function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<ColumnDragData | TaskDragData>;
} {
  if (!entry) return false;

  const data = entry.data.current;
  if (data?.type === "Column" || data?.type === "Task") return true;

  return false;
}

type Props = {
  tasks: PopulatedTask[];
  onChange: (tasks: PopulatedTask[]) => void;
};

export const TaskKanbanBoard = ({ tasks: initialTasks, onChange }: Props) => {
  const dndContext = useDndContext();

  const [columns, setColumns] = useState<TaskStatus[]>(
    Object.values(TASK_STATUS)
  );
  const [tasks, setTasks] = useState<PopulatedTask[]>([]);
  const [activeTask, setActiveTask] = useState<PopulatedTask | null>(null);
  const [activeColumn, setActiveColumn] = useState<TaskStatus | null>(null);

  const columnsId = useMemo(() => columns.map((col) => col), [columns]);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks.sort((a, b) => b.position - a.position));
    }
  }, [initialTasks]);

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;

    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    if (!over || !hasDraggableData(active)) return;
    onChange(tasks);
    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col === active.id);
      const overColumnIndex = columns.findIndex((col) => col === over.id);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    if (active.id === over.id) return;
    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const overData = over.data.current;
    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;

    const isOverATask = overData?.type === "Task";
    // dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const overIndex = tasks.findIndex((t) => t.id === over.id);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (activeTask && overTask && activeTask.status !== overTask.status) {
          activeTask.status = overTask.status;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";
    // dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === active.id);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.status = over.id as TaskStatus;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <ScrollArea
        className={variations({
          dragging: dndContext.active ? "active" : "default",
        })}
      >
        <div className="flex flex-row justify-center gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <BoardColumn
                key={col}
                column={col}
                tasks={tasks.filter((task) => task.status === col)}
              />
            ))}
          </SortableContext>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter((task) => task.status === activeColumn)}
              />
            )}
            {activeTask && <KanbanCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
};

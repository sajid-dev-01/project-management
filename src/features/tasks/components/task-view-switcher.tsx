"use client";

import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useBulkUpdateTask, useTasks } from "../api";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { PopulatedTask } from "../types";
import { TasksCalendar } from "./calendar/tasks-calendar";
import { columns } from "./data-table/table-column";
import { DataTable } from "./data-table/tasks-table";
import { TaskKanbanBoard } from "./kanban/board";
import { TaskFilters } from "./task-filters";

interface Props {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ hideProjectFilter }: Props) => {
  const workspaceId = useWorkspaceId();
  const [filters] = useTaskFilters();
  const [view, setView] = useQueryState("task-view", { defaultValue: "table" });

  const { data: tasks, isLoading } = useTasks({ ...filters, workspaceId });

  const { open: openCreateModal } = useCreateTaskModal();
  const { mutate: bulkUpdate } = useBulkUpdateTask();

  const onKanbanChange = useCallback(
    (tasks: PopulatedTask[]) => {
      bulkUpdate({ json: { tasks } });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      className="w-full flex-1 rounded-lg border"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="flex h-full flex-col overflow-auto p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 md:flex-row">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="table" className="h-8 w-full md:w-auto">
              Table
            </TabsTrigger>
            <TabsTrigger value="kanban" className="h-8 w-full md:w-auto">
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calender" className="h-8 w-full md:w-auto">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            className="w-full md:w-auto"
            onClick={() => openCreateModal()}
          >
            <PlusIcon className="size-4" />
            New
          </Button>
        </div>
        <Separator className="my-4" />
        <TaskFilters hideProjectFilter={hideProjectFilter} />
        <Separator className="my-4" />
        {isLoading ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
            <Loader className="text-muted-foreground size-5 animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent className="mt-0" value="table">
              <DataTable columns={columns} data={tasks ?? []} />
            </TabsContent>
            <TabsContent className="mt-0" value="kanban">
              <div className="grid">
                <TaskKanbanBoard data={tasks ?? []} onChange={onKanbanChange} />
              </div>
            </TabsContent>
            <TabsContent className="mt-0 h-full pb-4" value="calender">
              <TasksCalendar data={tasks ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

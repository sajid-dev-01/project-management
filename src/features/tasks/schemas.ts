import { z } from "zod";

import { TASK_STATUS, TaskStatus } from "@/db/schema";

export const createTaskSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  status: z.enum(Object.values(TASK_STATUS) as [TaskStatus]),
  workspaceId: z.string().trim().min(1, "Required"),
  projectId: z.string().trim().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "Required"),
  desc: z.string().optional(),
});
export type CreateTaskDto = z.infer<typeof createTaskSchema>;

export const taskQuerySchema = z.object({
  workspaceId: z.string().nullish(),
  projectId: z.string().nullish(),
  assigneeId: z.string().nullish(),
  status: z.enum(Object.values(TASK_STATUS) as [TaskStatus]).nullish(),
  search: z.string().nullish(),
  dueDate: z.coerce.date().nullish(),
});
export type TaskQueryDto = z.infer<typeof taskQuerySchema>;

export const bulkTasksUpdateSchema = z.object({
  tasks: z.array(
    z.object({
      id: z.string(),
      status: z.enum(Object.values(TASK_STATUS) as [TaskStatus]),
      position: z.number().int().positive().max(1_000_000),
    })
  ),
});
export type BulkTaskUpdateDto = z.infer<typeof bulkTasksUpdateSchema>;

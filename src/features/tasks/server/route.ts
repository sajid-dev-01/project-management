import { Hono } from "hono";

import { sessionMiddleware } from "@/lib/session-middleare";
import { validator } from "@/server/helpers";
import {
  bulkTasksUpdate,
  createTask,
  deleteUserTask,
  getAllTaskOfWorkspace,
  getTaskById,
  updateTaskById,
} from "@/services/task-service";

import {
  bulkTasksUpdateSchema,
  createTaskSchema,
  taskQuerySchema,
} from "../schemas";

export const taskRoutes = new Hono()
  .post(
    "/",
    sessionMiddleware,
    validator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const dto = c.req.valid("json");
      const data = await createTask(user.id, dto);

      return c.json({ data });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    validator("query", taskQuerySchema),
    async (c) => {
      const user = c.get("user");
      const query = c.req.valid("query");
      const data = await getAllTaskOfWorkspace(user.id, query);

      return c.json({ data });
    }
  )
  .get("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { taskId } = c.req.param();
    const data = await getTaskById({ userId: user.id, taskId });

    return c.json({ data });
  })
  .patch(
    "/:taskId",
    sessionMiddleware,
    validator("json", createTaskSchema.partial()),
    async (c) => {
      const { taskId } = c.req.param();
      const dto = c.req.valid("json");
      await updateTaskById(taskId, dto);

      return c.json({ data: { id: taskId } });
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { taskId } = c.req.param();
    await deleteUserTask({ userId: user.id, taskId });

    return c.json({ data: { id: taskId } });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    validator("json", bulkTasksUpdateSchema),
    async (c) => {
      const user = c.get("user");
      const { tasks } = c.req.valid("json");
      const data = await bulkTasksUpdate(user.id, tasks);

      return c.json({ data });
    }
  );

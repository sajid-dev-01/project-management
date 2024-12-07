import { Hono } from "hono";
import { z } from "zod";

import { sessionMiddleware } from "@/lib/session-middleare";
import { validator } from "@/server/helpers";
import {
  createProject,
  deleteUserProject,
  getAllProjectOfWorkspace,
  getProjectAnalytics,
  updateUserProject,
} from "@/services/project-service";

import { createProjectSchema, updateProjectSchema } from "../schemas";

export const projectRoutes = new Hono()
  .post(
    "/",
    sessionMiddleware,
    validator("json", createProjectSchema),
    async (c) => {
      const user = c.get("user");
      const dto = c.req.valid("json");
      const data = await createProject(user.id, dto);

      return c.json({ data });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    validator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");
      const data = await getAllProjectOfWorkspace({
        userId: user.id,
        workspaceId,
      });

      return c.json({ data });
    }
  )
  .patch(
    "/:projectId",
    sessionMiddleware,
    validator("json", updateProjectSchema),
    async (c) => {
      const user = c.get("user");
      const { projectId } = c.req.param();
      const dto = c.req.valid("json");
      const data = await updateUserProject({
        userId: user.id,
        projectId,
        data: dto,
      });

      return c.json({ data: { id: data.lastInsertRowid ?? projectId } });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { projectId } = c.req.param();
    const data = await deleteUserProject({ userId: user.id, projectId });

    return c.json({ data: { id: data.lastInsertRowid ?? projectId } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { projectId } = c.req.param();
    const data = await getProjectAnalytics({ userId: user.id, projectId });

    return c.json({ data });
  });

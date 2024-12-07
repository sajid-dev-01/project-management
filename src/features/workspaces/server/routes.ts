import { Hono } from "hono";
import { z } from "zod";

import { NotFoundError } from "@/lib/errors";
import { sessionMiddleware } from "@/lib/session-middleare";
import { validator } from "@/server/helpers";
import {
  createWorkspace,
  getUserWorkspace,
  getUserWorkspaces,
  getWorkspaceAnalytics,
  getWorkspaceMembers,
  joinWorkspace,
  removeUserWorkspace,
  resetWorkspaceInviteCode,
  updateUserWorkspace,
} from "@/services/workspace-service";

import { createWorkspaceSchema } from "../schemas";

export const workspaceRoutes = new Hono()
  .post(
    "/",
    sessionMiddleware,
    validator("json", createWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const dto = c.req.valid("json");
      const data = await createWorkspace({ ...dto, userId: user.id });

      return c.json({ data });
    }
  )
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const data = await getUserWorkspaces(user.id);

    return c.json({ data });
  })
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const data = await getUserWorkspace({ userId: user.id, workspaceId });

    return c.json({ data });
  })
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    validator("json", createWorkspaceSchema),
    async (c) => {
      const user = c.get("user");
      const dto = c.req.valid("json");
      const { workspaceId } = c.req.param();
      const data = await updateUserWorkspace({
        ...dto,
        workspaceId,
        userId: user.id,
      });

      return c.json({ data });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const data = await removeUserWorkspace({ userId: user.id, workspaceId });

    return c.json({ data: { id: data.lastInsertRowid ?? workspaceId } });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const data = await getUserWorkspace({ userId: user.id, workspaceId });
    if (!data) throw new NotFoundError();

    return c.json({
      data: {
        id: data.id,
        name: data.name,
        image: data.image,
      },
    });
  })
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const data = await getWorkspaceAnalytics({ userId: user.id, workspaceId });

    return c.json({ data });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const data = await resetWorkspaceInviteCode({
      userId: user.id,
      workspaceId,
    });

    return c.json({ data });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    validator("json", z.object({ code: z.string() })),
    async (c) => {
      const user = c.get("user");
      const { workspaceId } = c.req.param();
      const { code } = c.req.valid("json");
      const data = await joinWorkspace({ userId: user.id, workspaceId, code });

      return c.json({ data });
    }
  )
  .get("/:workspaceId/members", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const { workspaceId } = c.req.param();
    const data = await getWorkspaceMembers({ userId: user.id, workspaceId });
    data.push({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: "ADMIN",
    });

    return c.json({ data });
  });

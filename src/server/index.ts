import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import { projectRoutes } from "@/features/projects/server/route";
import { taskRoutes } from "@/features/tasks/server/route";
import { workspaceRoutes } from "@/features/workspaces/server/routes";
import { ApplicationError } from "@/lib/errors";

const app = new Hono().basePath("/api");

const routes = app
  .route("/workspaces", workspaceRoutes)
  .route("/projects", projectRoutes)
  .route("/tasks", taskRoutes)
  .onError((err, c) => {
    if (err instanceof HTTPException) {
      return c.json({ message: err.message, name: err.name }, 400);
    }

    if (err instanceof ApplicationError) {
      return c.json({ message: err.message, name: err.name }, err.statusCode);
    }

    return c.json({ message: "Server error" }, 500);
  });

export type AppType = typeof routes;
export { app };

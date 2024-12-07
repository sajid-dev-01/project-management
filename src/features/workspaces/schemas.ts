import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1),
  image: z.string().optional(),
});
export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;

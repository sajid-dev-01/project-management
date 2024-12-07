import { zValidator } from "@hono/zod-validator";
import { ValidationTargets } from "hono";
import { ZodSchema } from "zod";

export const validator = <
  K extends keyof ValidationTargets,
  ZS extends ZodSchema,
>(
  target: K,
  schema: ZS
) => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      return c.json({ error: result.error.flatten() }, 400);
    }
  });
};

import "server-only";

import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";

import appConfig from "@/configs/app-config";
import { authenticate } from "@/features/auth/lib/auth";

import {
  ApplicationError,
  AuthenticationError,
  ValidationError,
} from "./errors";

// Base client.
export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(err) {
    console.error("Action error:", err.message);

    if (err instanceof ValidationError) {
      return {
        name: "ValidationError",
        message: err.message,
        fieldErrors: err.fieldErrors,
      } as const;
    }

    if (err instanceof ApplicationError) {
      return { name: err.name, message: err.message } as const;
    }

    if (appConfig.env === "production") {
      return { code: "ERROR", message: DEFAULT_SERVER_ERROR_MESSAGE } as const;
    }

    return { name: err.name, cause: err.cause, message: err.message } as const;
  },
  defineMetadataSchema() {
    return z.object({ actionName: z.string() });
  },
  // Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  const startTime = performance.now();

  // Here we await the action execution.
  const { ctx, parsedInput, ...result } = await next();

  const endTime = performance.now();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);
  console.log("Action execution took", endTime - startTime, "ms");

  // And then return the result of the awaited action.
  return result;
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {
    const auth = await authenticate();

    if (!auth) {
      throw new AuthenticationError();
    }

    // Return the next middleware with `userId` value in the context
    return await next({ ctx: auth });
  });

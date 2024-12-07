import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

import * as table from "./db/schema";

export type TableID = string;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? RecursivelyReplaceNullWithUndefined<U>[]
    : T extends Record<string, unknown>
      ? { [K in keyof T]: RecursivelyReplaceNullWithUndefined<T[K]> }
      : T;

export type User = typeof table.users.$inferSelect;
export type Account = typeof table.accounts.$inferSelect;
export type Session = typeof table.sessions.$inferSelect;
export type Workspace = typeof table.workspaces.$inferSelect;
export type Member = typeof table.members.$inferSelect;
export type Project = typeof table.projects.$inferSelect;
export type Task = typeof table.tasks.$inferSelect;

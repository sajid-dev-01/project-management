import { relations } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { userAgent } from "next/server";

export const TASK_STATUS = {
  BACKLOG: "BACKLOG",
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE",
} as const;

export type VerificationType = "email" | "magic-link";
export type AccountType = "email" | "oidc" | "oauth" | "webauthn";
export type OAuthProvider = "google" | "github" | "facebook";
export type MemberRole = "ADMIN" | "MEMBER";
export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

const timestamp = {
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
};

export const roles = sqliteTable("role", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  permissions: text("permissions", { mode: "json" }).$type<any>(),
  ...timestamp,
});

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  roleId: text("roleId").references(() => roles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password"),
  emailVerified: integer("emailVerifiedAt", { mode: "timestamp" }),
  image: text("image"),
  ...timestamp,
});

export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accountType: text("accountType").$type<AccountType>().notNull(),
    provider: text("provider").$type<OAuthProvider>().notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refreshToken"),
    accessToken: text("accessToken"),
    expiresAt: integer("expiresAt"),
    tokenType: text("tokenType"),
    scope: text("scope"),
    idToken: text("idToken"),
    sessionState: text("sessionState"),
  },
  (account) => ({
    pk: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verifications = sqliteTable("verification", {
  email: text("email")
    .references(() => users.email, { onDelete: "cascade" })
    .notNull()
    .primaryKey(),
  type: text("type").$type<VerificationType>().notNull(),
  token: text("token").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent", { mode: "json" }).$type<
    ReturnType<typeof userAgent>
  >(),
});

export const workspaces = sqliteTable("workspace", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  name: text("name").notNull(),
  image: text("image"),
  inviteCode: text("inviteCode"),
  ...timestamp,
});
export const workspaceRelations = relations(workspaces, ({ many }) => ({
  tasks: many(projects),
  members: many(members),
}));

export const members = sqliteTable("member", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  workspaceId: text("workspaceId")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  role: text("role").$type<MemberRole>().notNull(),
});
export const memberRelations = relations(members, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}));

export const projects = sqliteTable("project", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  image: text("image"),
});
export const projectRelations = relations(projects, ({ many, one }) => ({
  tasks: many(tasks),
  workspace: one(workspaces, {
    fields: [projects.workspaceId],
    references: [workspaces.id],
  }),
}));

export const tasks = sqliteTable("taks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workspaceId: text("workspaceId")
    .references(() => workspaces.id, { onDelete: "cascade" })
    .notNull(),
  assigneeId: text("assigneeId")
    .references(() => users.id, { onDelete: "set null" })
    .notNull(),
  projectId: text("projectId")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status").$type<TaskStatus>().notNull(),
  position: integer("position").notNull(),
  dueDate: integer("dueDate", { mode: "timestamp" }).notNull(),
  name: text("name").notNull(),
  desc: text("desc"),
  ...timestamp,
});

export const taskRelations = relations(tasks, ({ one }) => ({
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

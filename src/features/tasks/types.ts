import { Prettify, Project, Task, User } from "@/types";

export type PopulatedTask = Prettify<
  Omit<Task, "projectId" | "assigneeId"> & {
    project: Project;
    assignee: Pick<User, "id" | "name" | "email" | "image">;
  }
>;

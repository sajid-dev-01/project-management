import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";
import { ProjectAnalytics } from "@/features/projects/components/project-analytics";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { cn } from "@/lib/utils";
import { getProjectById } from "@/services/project-service";

interface Props {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

export default async function ProjectIdPage({ params }: Props) {
  const { projectId } = await params;
  const auth = await authenticate();
  if (!auth) redirect(AUTH_URI.signIn);

  const project = await getProjectById({ userId: auth.user.id, projectId });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Avatar className={cn("size-8 rounded-md")}>
            <AvatarFallback
              className={cn(
                "rounded-md bg-blue-600 text-sm font-semibold uppercase text-white"
              )}
            >
              {project.name[0]}
            </AvatarFallback>
          </Avatar>
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div className="">
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${project.id}/settings`}
            >
              <PencilIcon className="mr-2 size-4" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <ProjectAnalytics />
      <TaskViewSwitcher hideProjectFilter={true} />
    </div>
  );
}

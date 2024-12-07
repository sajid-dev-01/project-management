import { redirect } from "next/navigation";

import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";
import { ProjectList } from "@/features/projects/components/project-list";
import { TaskList } from "@/features/tasks/components/task-list";
import { MemberList } from "@/features/workspaces/components/member-list";
import { WorkspaceAnalytics } from "@/features/workspaces/components/workspace-analytics";
import { isWorkspaceMember } from "@/services/workspace-service";

interface Props {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const auth = await authenticate();
  if (!auth?.session) return redirect(AUTH_URI.signIn);

  const { workspaceId } = await params;
  if (!(await isWorkspaceMember({ userId: auth.user.id, workspaceId }))) {
    return redirect("/");
  }

  const tasks = { data: [], total: 0 };

  return (
    <div className="flex h-full flex-col space-y-4">
      <WorkspaceAnalytics />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <TaskList
          workspaceId={workspaceId}
          tasks={tasks.data}
          total={tasks.total}
        />
        <ProjectList />
        <MemberList />
      </div>
    </div>
  );
}

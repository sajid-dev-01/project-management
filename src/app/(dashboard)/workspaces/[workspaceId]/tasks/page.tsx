import { redirect } from "next/navigation";

import { authenticate } from "@/features/auth/lib/auth";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { isWorkspaceMember } from "@/services/workspace-service";

interface Props {
  params: Promise<{ workspaceId: string }>;
}
export default async function TasksPag({ params }: Props) {
  const auth = await authenticate();
  if (!auth) redirect("/sign-in");

  const { workspaceId } = await params;
  if (!(await isWorkspaceMember({ userId: auth.user.id, workspaceId }))) {
    return redirect("/");
  }

  return (
    <div className="flex h-full flex-col">
      <TaskViewSwitcher />
    </div>
  );
}

import { redirect } from "next/navigation";

import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";
import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { getUserWorkspace } from "@/services/workspace-service";

interface Props {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceSettingsPag({ params }: Props) {
  const [{ workspaceId }, auth] = await Promise.all([params, authenticate()]);

  if (!auth) return redirect(AUTH_URI.signIn);

  const workspace = await getUserWorkspace({
    workspaceId,
    userId: auth.user.id,
  });

  if (!workspace) return redirect("/");

  return (
    <div className="px-4">
      <UpdateWorkspaceForm workspace={workspace} />
    </div>
  );
}

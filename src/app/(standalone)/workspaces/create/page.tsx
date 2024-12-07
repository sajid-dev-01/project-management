import { redirect } from "next/navigation";

import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { getUserWorkspaces } from "@/services/workspace-service";

export default async function CreateWorkspacePage() {
  const auth = await authenticate();
  if (!auth?.session) return redirect(AUTH_URI.signIn);

  const workspaces = await getUserWorkspaces(auth.user.id);
  if (workspaces.length > 0) {
    return redirect(`/workspaces/${workspaces[0].id}`);
  }

  return (
    <div className="grid place-items-center pt-10">
      <CreateWorkspaceForm />
    </div>
  );
}

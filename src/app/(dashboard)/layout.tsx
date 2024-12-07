import { redirect } from "next/navigation";

import { KBar } from "@/components/dashboard/kbar";
import { AppSidebar } from "@/components/dashboard/sidebar/app-sidebar";
import SearchInput from "@/components/dashboard/sidebar/search-input";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserMenu } from "@/components/user-menu";
import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { UpdateTaskModal } from "@/features/tasks/components/update-task-modal";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";

type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const auth = await authenticate();
  if (!auth?.session) return redirect(AUTH_URI.signIn);

  return (
    <KBar>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="inline-flex w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="mr-auto inline-flex items-center gap-2">
                <SearchInput />
              </div>
              <ThemeToggle />
              {auth?.user && <UserMenu user={auth.user} />}
            </div>
          </header>
          <main className="mt-4 px-4">
            <CreateWorkspaceModal />
            <CreateProjectModal />
            <CreateTaskModal />
            <UpdateTaskModal />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}

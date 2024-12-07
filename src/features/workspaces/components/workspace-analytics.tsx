"use client";

import { useParams } from "next/navigation";

import Analytics from "@/components/dashboard/analytics";
import { Skeleton } from "@/components/ui/skeleton";

import { useWorkspaceAnalytics } from "../api";

export const WorkspaceAnalytics = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  if (!workspaceId) return null;

  const { data, isPending } = useWorkspaceAnalytics(workspaceId);

  if (isPending)
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[100px] w-full" />
      </div>
    );

  if (!data) return null;

  return <Analytics data={data} />;
};

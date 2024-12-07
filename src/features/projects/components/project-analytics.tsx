"use client";

import { useParams } from "next/navigation";

import Analytics from "@/components/dashboard/analytics";

import { useProjectAnalytics } from "../api";

export const ProjectAnalytics = () => {
  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) return null;

  const { data } = useProjectAnalytics(projectId);
  if (!data) return null;

  return <Analytics data={data} />;
};

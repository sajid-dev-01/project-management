"use client";

import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui-extension/dotted-separetor";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useProjects } from "../api";
import { useCreateProjectModal } from "../hooks/use-create-project-modal";

export const ProjectList = () => {
  const workspaceId = useWorkspaceId();
  const { setIsOpen: openProjectModal } = useCreateProjectModal();
  const { data: projects } = useProjects(workspaceId);

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="mb-2 flex items-center justify-between">
            <p className="text-lg font-semibold">
              Projects ({projects?.length ?? "0"})
            </p>
            <Button
              variant={"secondary"}
              size={"icon"}
              onClick={() => openProjectModal(true)}
            >
              <PlusIcon className="size-4 text-neutral-400" />
            </Button>
          </CardTitle>
          <DottedSeparator className="my-4" />
        </CardHeader>
        <CardContent>
          {(projects?.length ?? 0) > 0 ? (
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {projects?.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/workspaces/${workspaceId}/projects/${project.id}`}
                  >
                    <Card className="rounded-lg shadow-none transition hover:opacity-75">
                      <CardContent className="flex items-center gap-x-2.5 p-4">
                        <Avatar className="size-12">
                          <AvatarImage src={project.image || ""} />
                          <AvatarFallback>{project.name[0]}</AvatarFallback>
                        </Avatar>
                        <p className="truncate text-lg font-medium">
                          {project.name}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-center text-sm">
              No Projects Found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

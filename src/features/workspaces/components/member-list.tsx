"use client";

import { SettingsIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/ui-extension/dotted-separetor";

import { useWorkspaceMembers } from "../api";
import { useWorkspaceId } from "../hooks/use-workspace-id";

export const MemberList = () => {
  const workspaceId = useWorkspaceId();

  const { data: members } = useWorkspaceMembers(workspaceId);

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({members?.length})</p>
          <Button variant={"secondary"} size={"icon"} asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members?.map((member) => (
            <li key={member.id}>
              <Card className="overflow-hidden rounded-lg shadow-none">
                <CardContent className="flex flex-col items-center gap-x-2 p-3">
                  <Avatar className="size-12 rounded-full border border-neutral-300 transition">
                    <AvatarFallback className="flex items-center justify-center bg-neutral-200 font-medium text-neutral-500">
                      {member.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-center overflow-auto">
                    <p className="line-clamp-1 text-lg font-medium">
                      {member.name}
                    </p>
                    <p className="text-muted-foreground line-clamp-1 text-sm">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-muted-foreground hidden text-center text-sm first-of-type:block">
            No Members Fount
          </li>
        </ul>
      </div>
    </div>
  );
};

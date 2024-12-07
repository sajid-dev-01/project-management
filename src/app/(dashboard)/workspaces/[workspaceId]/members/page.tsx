import Image from "next/image";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLACEHOLDER_IMAGE } from "@/constants";
import { AUTH_URI } from "@/features/auth/constants";
import { authenticate } from "@/features/auth/lib/auth";
import { getWorkspaceMembers } from "@/services/workspace-service";

interface Props {
  params: Promise<{ workspaceId: string }>;
}

export default async function WorkspaceMembersPage({ params }: Props) {
  const [auth, { workspaceId }] = await Promise.all([authenticate(), params]);
  if (!auth) return redirect(AUTH_URI.signIn);

  const members = await getWorkspaceMembers({
    userId: auth.user.id,
    workspaceId,
  });

  return (
    <div className="px-4">
      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {members.map((member) => (
              <li
                key={`member-${member.id}`}
                className="inline-flex items-center gap-2"
              >
                <Image
                  src={member.image || PLACEHOLDER_IMAGE}
                  alt="member image"
                  height={30}
                  width={30}
                />
                {member.name}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

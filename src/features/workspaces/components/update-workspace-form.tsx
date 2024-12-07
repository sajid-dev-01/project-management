"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/components/ui-extension/alert";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { DottedSeparator } from "@/components/ui-extension/dotted-separetor";
import { UploadDropzone } from "@/components/upload/upload-thing";
import { env } from "@/env";
import { handleQueryError } from "@/lib/handle-query-error";
import { Workspace } from "@/types";

import {
  useDeleteWorkspace,
  useResetInviteCode,
  useUpdateWorkspace,
} from "../api";
import { CreateWorkspaceDto, createWorkspaceSchema } from "../schemas";

interface Props {
  workspace: Workspace;
}

export const UpdateWorkspaceForm = ({ workspace }: Props) => {
  const confirm = useConfirm();
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResetting } =
    useResetInviteCode();

  const form = useForm<CreateWorkspaceDto>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: workspace.name,
      image: workspace.image ?? "",
    },
  });

  const fullInviteLink = `${env.NEXT_PUBLIC_APP_URL}/workspaces/${workspace.id}/join/${workspace.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  const handleSubmit = (json: CreateWorkspaceDto) => {
    mutate(
      { json, param: { workspaceId: workspace.id } },
      {
        onError: (err) => handleQueryError(err, form),
      }
    );
  };

  const handleDelete = async () => {
    const isConfirm = await confirm({
      title: "Are you sure to delete?",
    });

    if (isConfirm) {
      deleteWorkspace({ param: { workspaceId: workspace.id } });
    }
  };

  const handleResetInviteCode = async () => {
    const ok = await confirm({
      title: "Are you sure to reset?",
    });
    if (!ok) return;

    resetInviteCode({
      param: {
        workspaceId: workspace.id,
      },
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Update a new workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl className="rounded-md border border-dashed">
                        {workspace.image ? (
                          <Image
                            src={workspace.image}
                            alt="workspace image"
                            height={60}
                            width={60}
                          />
                        ) : (
                          <UploadDropzone
                            className="border-border"
                            endpoint={"workspaceImage"}
                            onClientUploadComplete={(res) => {
                              console.log({ res });
                              field.onChange(res[0].url);
                            }}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <ButtonLoading
                type="submit"
                loading={isPending}
                className="w-full"
              >
                update
              </ButtonLoading>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invite Member</CardTitle>
          <CardDescription>
            {" "}
            Use the invite link to add members to your workspace{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input disabled value={fullInviteLink} />
              <Button
                onClick={handleCopyInviteLink}
                variant={"secondary"}
                size="icon"
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>
            <DottedSeparator className="py-7" />
            <ButtonLoading
              loading={isPending || isResetting}
              onClick={handleResetInviteCode}
            >
              Reset Invite
            </ButtonLoading>
          </div>
        </CardContent>
      </Card>
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Deleting a workspace is irreversible and will remove all associated
            data
          </p>
          <ButtonLoading
            loading={isPending || isDeleting}
            variant={"destructive"}
            onClick={handleDelete}
          >
            Delete Workspace
          </ButtonLoading>
        </CardContent>
      </Card>
    </div>
  );
};

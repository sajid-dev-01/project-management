"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { UploadDropzone } from "@/components/upload/upload-thing";
import { cn } from "@/lib/utils";
import { Project } from "@/types";

import { useDeleteProject, useUpdateProject } from "../api";
import { updateProjectSchema } from "../schemas";

interface Props {
  onCancel?: () => void;
  initialValue: Project;
}

export const UpdateProjectForm = ({ onCancel, initialValue }: Props) => {
  const router = useRouter();
  const confirm = useConfirm();

  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeletingProject } =
    useDeleteProject();

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: { ...initialValue, image: initialValue.image ?? "" },
  });

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    mutate({
      json: {
        ...values,
        image: values.image ?? "",
      },
      param: { projectId: initialValue.id },
    });
  };

  const handleDelete = async () => {
    const isConfirm = await confirm({
      title: "Are you sure to delete?",
    });

    if (isConfirm) {
      deleteProject({ param: { projectId: initialValue.id } });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="size-full border-none shadow-none">
        <CardHeader className="space-7-0 flex flex-row items-center gap-x-4 p-7">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValue.workspaceId}/projects/${initialValue.id}`
                    )
            }
          >
            <ArrowLeftIcon className="mr-2 size-4" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValue.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
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
                        {initialValue.image ? (
                          <Image
                            src={initialValue.image}
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
              <div className="flex items-center justify-between">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>

                <ButtonLoading
                  type="submit"
                  loading={isPending}
                  className="w-full"
                >
                  update
                </ButtonLoading>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="size-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <div className="font-bold">Danger Zone</div>
            <p className="text-muted-foreground text-sm">
              Deleting a project is irreversible and will remove all associated
              data
            </p>
            <Button
              className="ml-auto mt-6 w-fit"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isDeletingProject}
              onClick={handleDelete}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

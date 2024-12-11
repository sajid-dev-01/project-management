"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { UploadDropzone } from "@/components/upload/upload-thing";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { handleQueryError } from "@/lib/handle-query-error";
import { cn } from "@/lib/utils";

import { useCreateProject } from "../api";
import { CreateProjectDto, createProjectSchema } from "../schemas";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const form = useForm<CreateProjectDto>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", image: "", workspaceId },
  });

  const { mutate, isPending } = useCreateProject();

  function onSubmit(json: CreateProjectDto) {
    mutate(
      { json },
      {
        onSuccess: ({ data }) => {
          if (data.id) {
            router.push(
              `/workspaces/${workspaceId}/projects/${data.id}?projectId=${data.id}`
            );
          }
        },
        onError: (e) => handleQueryError(e, form),
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <UploadDropzone
                  className="border-border"
                  endpoint={"workspaceImage"}
                  onClientUploadComplete={(res) => {
                    console.log({ res });
                    field.onChange(res[0].url);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
            className={cn(!onCancel && "invisible")}
          >
            Cancel
          </Button>
          <ButtonLoading loading={isPending} type="submit">
            Create Project
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { UploadDropzone } from "@/components/upload/upload-thing";
import { handleQueryError } from "@/lib/handle-query-error";

import { useCreateWorkspace } from "../api";
import { CreateWorkspaceDto, createWorkspaceSchema } from "../schemas";

export const CreateWorkspaceForm = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();
  const form = useForm<CreateWorkspaceDto>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "", image: "" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new workspace</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) =>
              mutate(
                { json: v },
                {
                  onSuccess: ({ data }) => {
                    if (data?.id) router.replace(`/workspace/${data.id}`);
                  },
                  onError: (err) => handleQueryError(err, form),
                }
              )
            )}
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
            </div>
            <ButtonLoading type="submit" loading={isPending} className="w-full">
              create
            </ButtonLoading>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { DateTimePicker } from "@/components/ui-extension/datetime-picker";
import { AVATAR_PLACEHOLDER } from "@/constants";
import { TASK_STATUS } from "@/db/schema";
import { handleQueryError } from "@/lib/handle-query-error";
import { cn } from "@/lib/utils";

import { useUpdateTask } from "../api";
import { CreateTaskDto, createTaskSchema } from "../schemas";
import { PopulatedTask } from "../types";

interface Props {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; image: string | null }[];
  memberOptions: { id: string; name: string; image: string | null }[];
  initialTask: PopulatedTask;
}

export const UpdateTaskForm = ({
  onCancel,
  memberOptions,
  projectOptions,
  initialTask,
}: Props) => {
  const { mutate, isPending } = useUpdateTask();

  const form = useForm<Omit<CreateTaskDto, "workspaceId" | "desc">>({
    resolver: zodResolver(
      createTaskSchema.omit({ workspaceId: true, desc: true })
    ),
    defaultValues: {
      ...initialTask,
      dueDate: initialTask.dueDate ? new Date(initialTask.dueDate) : undefined,
    },
  });

  const onSubmit = (data: Omit<CreateTaskDto, "workspaceId" | "desc">) => {
    mutate(
      { json: data, param: { taskId: initialTask.id } },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
        onError: (e) => handleQueryError(e, form),
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter Task name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <DateTimePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assigneeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignee</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      <div className="flex items-center gap-x-2">
                        <Image
                          src={member?.image || AVATAR_PLACEHOLDER}
                          alt="member image"
                          height={30}
                          width={30}
                        />
                        {member.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  <SelectItem value={TASK_STATUS.BACKLOG}>Backlog</SelectItem>
                  <SelectItem value={TASK_STATUS.IN_PROGRESS}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TASK_STATUS.IN_REVIEW}>
                    In Review
                  </SelectItem>
                  <SelectItem value={TASK_STATUS.TODO}>Todo</SelectItem>
                  <SelectItem value={TASK_STATUS.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                </FormControl>
                <FormMessage />
                <SelectContent>
                  {projectOptions.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      <div className="flex items-center gap-x-2">
                        <Image
                          src={project.image || AVATAR_PLACEHOLDER}
                          alt="project image"
                          height={30}
                          width={30}
                        />
                        {project.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            Update Task
          </ButtonLoading>
        </div>
      </form>
    </Form>
  );
};

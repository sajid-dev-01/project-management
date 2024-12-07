"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { InputPassword } from "@/components/ui-extension/input-password";
import { env } from "@/env";
import { handleActionError } from "@/lib/handle-action-error";

import { AUTH_URI } from "../constants";
import { SignUpDto, SignUpSchema } from "../schemas";
import { signUpAction } from "../server/actions";
import AuthCard from "./auth-card";

const SignUp = () => {
  const router = useRouter();

  const form = useForm<SignUpDto>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "Sajid",
      email: "test@test.com",
      password: "123456",
    },
  });

  const { execute, isPending } = useAction(signUpAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: () => {
      toast.success("Sign up successfull!");
      router.push(AUTH_URI.verifyEmail);
    },
  });

  return (
    <AuthCard
      headerTitle={`Register to ${env.NEXT_PUBLIC_APP_NAME}`}
      headerDesc="Choose your preferred sign up method"
      buttonLabel="Already have an account?"
      buttonHref={AUTH_URI.signIn}
      showSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => execute(v))}
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
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Jhon Doe"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ButtonLoading type="submit" loading={isPending} className="w-full">
            Register
          </ButtonLoading>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignUp;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
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

import { AUTH_URI, DEFAULT_LOGIN_REDIRECT } from "../constants";
import { SignInDto, SignInSchema } from "../schemas";
import { signInAction } from "../server/actions";
import AuthCard from "./auth-card";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<SignInDto>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "test@test.com",
      password: "123456",
    },
  });

  const { execute, isPending } = useAction(signInAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: () => {
      toast.success("Login successfull!");

      const callbackUrl = searchParams.get("callback-url");

      router.push(callbackUrl ?? DEFAULT_LOGIN_REDIRECT);
    },
  });

  return (
    <AuthCard
      headerTitle={`Login to ${env.NEXT_PUBLIC_APP_NAME}`}
      headerDesc="Choose your preferred sign in method"
      buttonLabel="Don't have an account?"
      buttonHref={AUTH_URI.signUp}
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
                      placeholder="Enter password"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <ButtonLoading type="submit" loading={isPending} className="w-full">
            Login
          </ButtonLoading>
        </form>
      </Form>
    </AuthCard>
  );
};

export default SignIn;

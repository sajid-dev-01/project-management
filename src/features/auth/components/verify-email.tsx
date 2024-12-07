"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ButtonLoading } from "@/components/ui-extension/button-loading";
import { Heading } from "@/components/ui-extension/heading";
import { handleActionError } from "@/lib/handle-action-error";

import { AUTH_URI } from "../constants";
import { VerifyEmailDto, VerifyEmailSchema } from "../schemas";
import { resendCodeAction, verifyEmailAction } from "../server/actions";
import AuthCard from "./auth-card";

const VerifyEmail = ({ email }: { email: string }) => {
  const form = useForm<VerifyEmailDto>({
    resolver: zodResolver(VerifyEmailSchema),
    defaultValues: { otp: "" },
  });

  const { execute: resend, isPending: isResending } = useAction(
    resendCodeAction,
    {
      onError: ({ error }) => handleActionError(error, form),
      onSuccess: ({ data }) => {
        toast.success(data?.message);
      },
    }
  );

  const { execute, isPending, hasSucceeded } = useAction(verifyEmailAction, {
    onError: ({ error }) => handleActionError(error, form),
    onSuccess: () => {
      toast.success("Email successfully verified!");
    },
  });

  if (hasSucceeded) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-md">
        <CheckCircleIcon className="size-14 animate-bounce text-green-500" />
        <Heading>Email verification successfull</Heading>
        <Button asChild>
          <Link href={AUTH_URI.signIn}>
            Go to sign in
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <AuthCard
      headerTitle="Verify your email"
      headerDesc={
        <p className="text-center">
          Enter the verification code sent to your email <br /> {email}
        </p>
      }
      buttonLabel="Back to Sign Up"
      buttonHref={AUTH_URI.signUp}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => execute(v))}
          className="flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col items-center justify-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <Button
            size={"sm"}
            variant={"link"}
            onClick={() => resend()}
            disabled={isResending}
            className="mb-6 mt-2"
          >
            Didn't receive a code? Resend
          </Button>
          <ButtonLoading type="submit" loading={isPending} className="w-full">
            Verify
          </ButtonLoading>
        </form>
      </Form>
    </AuthCard>
  );
};

export default VerifyEmail;

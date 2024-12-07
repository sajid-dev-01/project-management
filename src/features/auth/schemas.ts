import * as z from "zod";

export const SignInSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6),
});
export type SignInDto = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export type SignUpDto = z.infer<typeof SignUpSchema>;

export const VerifyEmailSchema = z.object({
  otp: z.string().min(6),
});
export type VerifyEmailDto = z.infer<typeof VerifyEmailSchema>;

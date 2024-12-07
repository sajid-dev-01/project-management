import * as z from "zod";

export const updateAccountSchema = z.object({});

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
export const phoneSchema = z.object({
  phone: z.string().regex(phoneRegex, "Invalid number"),
});
export type PhoneDto = z.infer<typeof phoneSchema>;

export const imageSchema = z.instanceof(File).refine((file) => {
  const allowedFile = ["image/png", "image/jpg", "image/jpeg", "image/svg+xml"];
  return allowedFile.includes(file.type);
});

export const updateAppearanceSchema = z.object({
  theme: z.string(),
  font: z.string(),
});

export const updateDisplaySchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

export const updateNotificationSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
  mobile: z.boolean().default(false).optional(),
  communication_emails: z.boolean().default(false).optional(),
  social_emails: z.boolean().default(false).optional(),
  marketing_emails: z.boolean().default(false).optional(),
  security_emails: z.boolean(),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  image: z.string().optional(),
  dob: z
    .date({
      required_error: "A date of birth is required.",
    })
    .optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  address: z.string().optional(),
  language: z
    .string({
      required_error: "Please select a language.",
    })
    .optional(),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password not matched",
    path: ["confirmPassword"],
  });

export const verifyOTPSchema = z.object({
  code: z.string(),
});

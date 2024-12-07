"use server";

import { AuthenticationError } from "@/lib/errors";
import { authActionClient } from "@/lib/safe-action";
import { validateCredential } from "@/services/auth-service";
import { updateUserById } from "@/services/user-service";

import {
  imageSchema,
  updatePasswordSchema,
  updateProfileSchema,
} from "../schemas";

export const updatePasswordAction = authActionClient
  .metadata({ actionName: "updatePasswordAction" })
  .schema(updatePasswordSchema)
  .action(async ({ parsedInput, ctx }) => {
    const user = ctx.user;
    const isValid = await validateCredential({
      email: user.email,
      password: parsedInput.currentPassword,
    });

    if (!isValid) throw new AuthenticationError();

    await updateUserById(user.id, { password: parsedInput.password });
  });

export const updateProfileAction = authActionClient
  .metadata({ actionName: "updateProfileAction" })
  .schema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    await updateUserById(ctx.user.id, parsedInput);
  });

export const uploadProfileImageAction = authActionClient
  .metadata({ actionName: "uploadProfileImageAction" })
  .schema(imageSchema)
  .action(async ({ parsedInput }) => {
    console.log(parsedInput);
  });

export const deleteProfileImageAction = authActionClient
  .metadata({ actionName: "deleteProfileImageAction" })
  .action(async ({ ctx }) => {
    if (!ctx.user.image) return;
    //if (uploadedFile.data?.key) await utapi.deleteFiles(uploadedFile.data.key)
  });

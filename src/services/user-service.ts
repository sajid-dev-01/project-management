import "server-only";

import { GoogleUser } from "@/features/auth/lib/auth";
import { ValidationError } from "@/lib/errors";
import { createOAuthAccount, getOauthAccount } from "@/repositories/accounts";
import { findUserByEmail, insertUser, updateUser } from "@/repositories/users";
import { TableID, User } from "@/types";

export async function createUser(
  input: Required<Pick<User, "email" | "name" | "password">>
) {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) throw new ValidationError({ email: ["Already exists!"] });

  return await insertUser(input);
}

export async function updateUserById(
  id: TableID,
  data: Partial<Omit<User, "id">>
) {
  return updateUser(id, data);
}

export async function createGoogleUser(
  googleUser: Pick<GoogleUser, "name" | "email" | "picture" | "sub">
) {
  let existingUser = await findUserByEmail(googleUser.email);
  if (!existingUser) {
    existingUser = await insertUser({
      email: googleUser.email,
      name: googleUser.name,
      image: googleUser.picture,
      emailVerified: new Date(),
    });
  }

  await createOAuthAccount({
    userId: existingUser.id,
    provider: "google",
    providerAccountId: googleUser.sub,
  });

  return existingUser;
}

export async function getAccountByGoogleId(googleId: string) {
  return getOauthAccount(googleId, "google");
}

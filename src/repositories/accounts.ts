import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";
import { Account, TableID } from "@/types";

export async function createAccount(data: Omit<Account, "id">) {
  const [res] = await db.insert(table.accounts).values(data).returning();
  return res;
}

export async function createOAuthAccount({
  userId,
  provider,
  providerAccountId,
}: {
  userId: TableID;
  providerAccountId: string;
  provider: table.OAuthProvider;
}) {
  await db
    .insert(table.accounts)
    .values({
      userId: userId,
      accountType: "oauth",
      provider,
      providerAccountId,
    })
    .onConflictDoNothing()
    .returning();
}

export async function getAccountByUserId(userId: TableID) {
  return db.query.accounts.findFirst({
    where: eq(table.accounts.userId, userId),
  });
}

export async function updateAccount(
  userId: TableID,
  data: Partial<Omit<Account, "id" | "userId">>
) {
  return db
    .update(table.accounts)
    .set(data)
    .where(
      and(
        eq(table.accounts.userId, userId),
        eq(table.accounts.accountType, "email")
      )
    );
}

export async function getOauthAccount(id: TableID, type: table.OAuthProvider) {
  return db.query.accounts.findFirst({
    where: and(
      eq(table.accounts.provider, type),
      eq(table.accounts.providerAccountId, id)
    ),
  });
}

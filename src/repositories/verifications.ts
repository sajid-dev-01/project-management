import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import * as table from "@/db/schema";

export async function getVerifyTokenByEmail(
  email: string,
  type: table.VerificationType
) {
  return db.query.verifications.findFirst({
    where: and(
      eq(table.verifications.email, email),
      eq(table.verifications.type, type)
    ),
  });
}

export async function upsertToken({
  email,
  expiresAt,
  token,
  type,
}: {
  email: string;
  token: string;
  expiresAt: Date;
  type: table.VerificationType;
}) {
  const [res] = await db
    .insert(table.verifications)
    .values({ email, type, expiresAt, token })
    .returning()
    .onConflictDoUpdate({
      target: table.verifications.email,
      set: { type, token, expiresAt },
    })
    .returning();
  return res;
}

export async function insertVerifyToken({
  email,
  expiresAt,
  token,
  type,
}: {
  email: string;
  token: string;
  expiresAt: Date;
  type: table.VerificationType;
}) {
  const [res] = await db
    .insert(table.verifications)
    .values({ email, type, expiresAt, token })
    .returning();
  return res;
}

export async function deleteVerifyToken(
  email: string,
  type: table.VerificationType
) {
  return db
    .delete(table.verifications)
    .where(
      and(
        eq(table.verifications.email, email),
        eq(table.verifications.type, type)
      )
    );
}

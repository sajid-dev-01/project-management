import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import dbConfig from "@/configs/db-config";

import * as schema from "./schema";

export const client = createClient({
  url: dbConfig.turso.url!,
  authToken: dbConfig.turso.token!,
});

export const db = drizzle(client, { schema });

// export async function createTransaction<T extends typeof db>(
//   cb: (trx: T) => void
// ) {
//   await db.transaction(cb as any);
// }

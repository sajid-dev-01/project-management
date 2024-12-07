import { eq } from "drizzle-orm";

import { db } from ".";
import * as dbTables from "./schema";

import "dotenv/config";

async function main() {
  // const user: typeof dbTables.users.$inferInsert = {
  //   name: 'John',
  //   age: 30,
  //   email: 'john@example.com',
  // };
  // await db.insert(dbTables.users).values(user);
  // console.log('New user created!')
  // const users = await db.select().from(dbTables.users);
  // console.log('Getting all users from the database: ', users)
  // /*
  // const users: {
  //   id: number;
  //   name: string;
  //   age: number;
  //   email: string;
  // }[]
  // */
  // await db
  //   .update(dbTables.users)
  //   .set({
  //     age: 31,
  //   })
  //   .where(eq(dbTables.users.email, user.email));
  // console.log('User info updated!')
  // await db.delete(dbTables.users).where(eq(dbTables.users.email, user.email));
  // console.log('User deleted!')
}

main();

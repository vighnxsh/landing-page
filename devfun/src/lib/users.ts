import { db } from "@/lib/db";
import "server-only";

export async function getUserByUsername(username: string) {
  if (!username) {
    return null;
  }
  
  console.log(`[lib/users] Searching for username: ${username}`);
  try {
    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
    });
    console.log(`[lib/users] User found in DB:`, user);
    return user;
  } catch (error) {
    console.error(`[lib/users] Error fetching user:`, error);
    return null;
  }
} 
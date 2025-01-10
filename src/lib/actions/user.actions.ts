import { currentUser } from "@clerk/nextjs/server"
import { createOrUpdateUserDB } from "../db/users.db";

export async function syncUserWithClerk() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    return await createOrUpdateUserDB({
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : null,
      image: user.imageUrl,
    })
  } catch (error) {
    throw new Error(`Error syncing user: ${error}`)
  }
};
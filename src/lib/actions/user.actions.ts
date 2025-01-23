/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { prisma } from "../db/prisma";
import { updateUserDB } from "../db/users.db";

export interface userDataParams {
  id: string,
  email: string,
  name?: string | null,
  image?: string | null,
}

export async function updateUser(userData: userDataParams) {
  try {
    return await updateUserDB(userData)
  } catch (error: any) {
    throw new Error(`Failed to save user: ${error.message}`);
  }
}

export interface addFriendsParams {
  email: string,
  currentUserId: string,
}

export async function addFriend({ email, currentUserId }: addFriendsParams) {
  try {
    // check if user with the email exists
    const userToAdd = await prisma.user.findUnique({
      where: { email }
    })

    // if user exists, create friend relationship
    if (userToAdd) {
      const existingFriendship = await prisma.friend.findFirst({
        where: {
          userId: currentUserId,
          friendId: userToAdd.id,
        }
      })

      if (existingFriendship) {
        return { error: "Already friends with this user"}
      }

      // create new friendship
      await prisma.friend.create({
        data: {
          userId: currentUserId,
          friendId: userToAdd.id,
        }
      })

      return { success: true, isExistingUser: true }
    }

    return { success: true, isExistingUser: false }
  } catch (error) {
    console.error("Failed to add friend: ", error)
    throw new Error("Failed to add friend");
  }
} 
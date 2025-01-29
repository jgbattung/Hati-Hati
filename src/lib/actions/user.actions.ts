/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { prisma } from "../db/prisma";
import { updateUserDB } from "../db/users.db";
import crypto from 'crypto';
import { add } from 'date-fns';

function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

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
  name: string,
}

export async function addFriend({ email, currentUserId, name }: addFriendsParams) {
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

      return {
        success: true,
        isExistingUser: true,
        user: {
          name: userToAdd.name,
          email: userToAdd.email,
        }
      }
    }

    // User doesn't exist, check for pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        status: 'PENDING',
      }
    });

    if (existingInvitation) {
      return { error: "An invitation has already been sent to this email" }
    }

    // Create a new invitation
    const token = generateInviteToken();
    const expiresAt = add(new Date(), { days: 7 });

    const invitation = await prisma.invitation.create({
      data: {
        email,
        invitedBy: currentUserId,
        token,
        expiresAt,
      }
    });


    return {
      success: true,
      isExistingUser: false,
      invitation: {
        email,
        name,
        token: invitation.token
      }
    }
  } catch (error) {
    console.error("Failed to add friend: ", error)
    throw new Error("Failed to add friend");
  }
} 
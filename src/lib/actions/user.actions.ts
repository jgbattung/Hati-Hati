/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import InvitationEmail from "@/components/emails/InvitationEmail";
import { prisma } from "../db/prisma";
import { updateUserDB } from "../db/users.db";
import crypto from 'crypto';
import { add } from 'date-fns';
import { Resend } from 'resend';
import { FRIEND_ERRORS, INVITATION_ERRORS, INVITE_ERRORS } from "../errors";
import { revalidatePath } from "next/cache";

function generateInviteToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export interface userDataParams {
  id: string,
  email: string,
  username: string,
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
  currentUserName: string,
  groupId?: string,
}


export async function addFriend({ email, currentUserId, currentUserName, groupId }: addFriendsParams) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // check if user with the email exists
    const userToAdd = await prisma.user.findUnique({
      where: { email }
    })

    // if user exists, create friend relationship
    if (userToAdd) {
      // check if friendship already exists
      const existingFriendship = await prisma.friend.findFirst({
        where: {
          OR: [
            { userId: currentUserId, friendId: userToAdd.id },
            { userId: userToAdd.id, friendId: currentUserId }
          ]
        }
      })

      if (existingFriendship) {
        return { error: FRIEND_ERRORS.ALREADY_FRIENDS}
      }

      // create 2 friendship records in a transaction
      await prisma.$transaction(async (tx) => {
        // create friendship record for current user
        await tx.friend.create({
          data: {
            userId: currentUserId,
            friendId: userToAdd.id,
          }
        });

        // create reciprocal friendship record
        await tx.friend.create({
          data: {
            userId: userToAdd.id,
            friendId: currentUserId,
          }
        });
      })

      revalidatePath('/friends')

      return {
        success: true,
        isExistingUser: true,
        user: {
          id: userToAdd.id,
          name: userToAdd.name,
          email: userToAdd.email,
        }
      }
    }

    // User doesn't exist, check for pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        invitedBy: currentUserId,
        status: 'PENDING',
      }
    });

    if (existingInvitation) {
      return { error: FRIEND_ERRORS.PENDING_INVITATION }
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
        groupId: groupId || null,
      }
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/accept/${invitation.token}`

    // In development, bypass email sending and just log the invite link
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - Invitation link:', inviteLink);
      console.log('Invitation details:', {
        inviterName: currentUserName,
        email: email,
        groupId: groupId,
      });
      
      return {
        success: true,
        isExistingUser: false,
        invitation: {
          email,
          token: invitation.token
        }
      }
    }

    try {
      const { error } = await resend.emails.send({
        from: 'Hati-Hati <onboarding@resend.dev>',
        to: [email],
        subject: groupId 
          ? `${currentUserName} invited you to join a group in Hati-Hati` 
          : `${currentUserName} invited you to join Hati-Hati`,
        react: InvitationEmail({
          inviterName: currentUserName,
          inviteLink,
          groupInvite: !!groupId
        })
      });

      if (error) {
        console.error('Failed to send email: ', error);
        // If email fails, delete the invitation
        await prisma.invitation.delete({
          where: { id: invitation.id }
        });
        return { error: FRIEND_ERRORS.EMAIL_SEND_FAILED }
      }
    } catch (emailError) {
      console.error('Email service error: ', emailError);
      // Delete the invitation if email fails
      await prisma.invitation.delete({
        where: { id: invitation.id }
      });
      return { error: FRIEND_ERRORS.EMAIL_SEND_FAILED }
    }

    return {
      success: true,
      isExistingUser: false,
      invitation: {
        email,
        token: invitation.token,
        groupId: groupId || null,
      }
    }
  } catch (error) {
    console.error("Failed to add friend: ", error)
    return { error: FRIEND_ERRORS.GENERAL_ERROR };
  }
};

export async function getUserFriends(currentUserId: string) {
  try {
    const friends = await prisma.friend.findMany({
      where: { userId: currentUserId },
      select: {
        friend: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return friends;
  } catch (error) {
    console.error("Failed to get user's friends: ", error)
  }
}

export async function validateInviteToken(token: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: {
        sender: {
          select: {
            name: true,
          }
        }
      }
    });

    // If no invitation found
    if (!invitation) {
      return { error: INVITE_ERRORS.INVALID_TOKEN }
    }

    // Check if invitaiton has expired
    if (invitation.expiresAt < new Date()) {
      // Update status to expired
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' }
      });
      return { error: INVITE_ERRORS.INVITATION_EXPIRED }
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      return { error: INVITE_ERRORS.INVITATION_ALREADY_USED }
    }

    return {
      success: true,
      invitation: {
        email: invitation.email,
        invitedBy: invitation.sender.name,
        groupId: invitation.groupId || null,
      }
    }
  } catch (error) {
    console.error('Error validating invitation token: ', error);
    return { error: INVITE_ERRORS.VALIDATION_ERROR }
  }
}

interface AcceptInvitationParams {
  id: string,
  name?: string | null,
  inviteToken: string,
}

interface AcceptInvitationSuccess {
  success: true;
  groupId: string | null;
}

interface AcceptInvitationError {
  success: false;
  error: keyof typeof INVITATION_ERRORS;
}

type AcceptInvitationResult = AcceptInvitationSuccess | AcceptInvitationError;

export async function acceptInvitation({
  id,
  inviteToken,
}: AcceptInvitationParams): Promise<AcceptInvitationResult> {
  try {
    // Validate the token
    const invitation = await prisma.invitation.findUnique({
      where: { token: inviteToken },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!invitation || invitation.status !== 'PENDING' || invitation.expiresAt < new Date()) {
      return { success: false, error: INVITATION_ERRORS.INVALID_OR_EXPIRED };
    }

    // Create friendships and update invitation status
    await prisma.$transaction(async (tx) => {
      // Create friendship record for the inviter
      await tx.friend.create({
        data: {
          userId: invitation.invitedBy,
          friendId: id,
        }
      });

      // Create reciprocal friendship record for the new user
      await tx.friend.create({
        data: {
          userId: id,
          friendId: invitation.invitedBy,
        }
      });

      // Add to group if invited via groups page
      if (invitation.groupId) {
        const newUser = await tx.user.findUnique({
          where: { id },
          select: { username: true, name: true }
        });

        // Create group membership
        await tx.groupMember.create({
          data: {
            groupId: invitation.groupId,
            userId: id,
            username: newUser!.username,
            displayName: newUser!.name,
            status: 'ACTIVE',
          }
        });
      }

      await tx.invitation.update({
        where: { id: invitation.id },
        data: {
          status: 'ACCEPTED',
        }
      });
    });

    revalidatePath('/groups')

    return {
      success: true,
      groupId: invitation.groupId || null,
    };

  } catch (error) {
    console.error('Error accepting invitation: ', error);
    return { success: false, error: INVITATION_ERRORS.FAILED_TO_PROCESS };
  }
}
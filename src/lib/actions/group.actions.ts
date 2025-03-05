'use server'

import { revalidatePath } from "next/cache";
import { prisma } from "../db/prisma";
import { GROUP_ERRORS } from "../errors";

interface CreateGroupParams {
  name: string;
  userId: string;
  username: string
  userDisplayName?: string
}

export async function createGroup({ name, userId, username, userDisplayName }: CreateGroupParams) {
  try {
    const group = await prisma.group.create({
      data: {
        name,
        ownerId: userId,
        currency: "PHP",
        members: {
          create: {
            userId,
            displayName: userDisplayName,
            username: username,
            status: "ACTIVE"
          }
        }
      },
      include: {
        members: true,
      }
    });

    revalidatePath('/groups');

    return {
      success: true,
      group
    };
  } catch (error) {
    console.error("Failed to create group: ", error);
    return {
      success: false,
      error: GROUP_ERRORS.CREATION_FAILED
    }
  }
}

interface GetGroupByIdParams {
  groupId: string;
  userId: string;
}

export async function getGroupById({ groupId, userId }: GetGroupByIdParams) {
  try {
      // Fetch the group with members
      const group = await prisma.group.findUnique({
        where: {
          id: groupId,
        },
        include: {
          members: {
            where: {
              status: 'ACTIVE'
            },
            orderBy: {
              joinedAt: 'asc'
            },
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                  image: true,
                }
              }
            }
          },
          owner: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
            }
          }
        }
      });
  
      if (!group) {
        return {
          success: false,
          error: GROUP_ERRORS.NOT_FOUND
        };
      }

    // Check if user is a member of the group
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        }
      }
    });

    if (!membership) {
      return {
        success: false,
        error: GROUP_ERRORS.UNAUTHORIZED,
      };
    }

    return {
      success: true,
      group,
    };
  } catch (error) {
    console.error("Failed to fetch group: ", error);
    return {
      success: false,
      error: GROUP_ERRORS.NOT_FOUND
    };
  }
}

interface GetUserGroupParams {
  userId: string;
}

export async function getUserGroups({ userId }: GetUserGroupParams) {
  try {
    // Find all active group memberships for the user
    const memberships = await prisma.groupMember.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        group: {
          include: {
            members: {
              where: {
                status: 'ACTIVE'
              }
            }
          }
        }
      },
      orderBy: {
        joinedAt: 'desc'
      }
    });

    const groups = memberships.map(membership => membership.group);

    return {
      success: true,
      groups,
    }
  } catch (error) {
    console.error("Failed to fetch user groups: ", error);
    return {
      success: false,
      error: GROUP_ERRORS.FETCH_FAILED
    };
  }
}
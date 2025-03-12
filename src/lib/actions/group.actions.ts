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

interface UpdateGroupDetailsParams {
  groupId: string;
  userId: string;
  name: string;
}

export async function updateGroupDetails({ groupId, userId, name }: UpdateGroupDetailsParams) {
  try {
    // Check if the user is a member of the group
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        }
      },
      select: { status: true }
    });

    if (!membership) {
      return {
        success: false,
        error: GROUP_ERRORS.UNAUTHORIZED,
      }
    }

    // Check if uer is an active member
    if (membership.status !== "ACTIVE") {
      return {
        success: false,
        error: GROUP_ERRORS.UNAUTHORIZED,
      } 
    }

    // Update group name
    const updateGroup = await prisma.group.update({
      where: {id: groupId },
      data: { name },
      include: {
        members: {
          where: { status: 'ACTIVE' },
          include:{
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              }
            }
          }
        }
      }
    });

    revalidatePath(`/groups/${groupId}`);
    revalidatePath(`/groups/${groupId}/settings`);
    revalidatePath('/groups');

    return {
      success: true,
      group: updateGroup
    };
  } catch (error) {
    console.error("Failed to update group details: ", error)
    return {
      success: false,
      error: GROUP_ERRORS.UPDATE_FAILED,
    }
  }
}

interface DeleteGroupParams {
  groupId: string;
  userId: string;
}

export async function deleteGroup({ groupId, userId }: DeleteGroupParams) {
  try {
    // Check if user is the owner of the group
    const group  = await prisma.group.findUnique({
      where: { id: groupId },
      select: { ownerId: true },
    });

    if (!group) {
      return {
        success: false,
        error: GROUP_ERRORS.NOT_FOUND
      };
    }

    if (group.ownerId !== userId) {
      return {
        success: false,
        error: GROUP_ERRORS.UNAUTHORIZED
      };
    }

    await prisma.group.delete({
      where: { id: groupId },
    });

    revalidatePath('/groups')

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete group: ", error);
    return {
      success: false,
      error: GROUP_ERRORS.DELETE_FAILED,
    }
  }
}
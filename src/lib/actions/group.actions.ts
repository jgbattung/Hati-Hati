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
                  email: true,
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
};

interface AddMembersToGroupParams {
  groupId: string;
  memberIds: string[];
  currentUserId: string;
}

export async function addMembersToGroup({
  groupId,
  memberIds,
  currentUserId
}: AddMembersToGroupParams) {
  try {
    // Verify if the current user is a member of the group
    const userMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: currentUserId,
        }
      }
    });

    if (!userMembership) {
      return {
        success: false,
        error: GROUP_ERRORS.UNAUTHORIZED,
      }
    }

    // Check for duplication
    const existingActiveMembers  = await prisma.groupMember.findMany({
      where: {
        groupId,
        userId: {
          in: memberIds
        },
         status: 'ACTIVE',
      },
      select: {
        userId: true,
      }
    });

    const existingMemberIds = existingActiveMembers.map((member) => member.userId);
    const newMemberIds = memberIds.filter(id => !existingMemberIds.includes(id));

    if (newMemberIds.length === 0) {
      return {
        success: false,
        error: GROUP_ERRORS.MEMBER_ALREADY_EXISTS,
      }
    }

    // Get user info for new members
    const usersToAdd = await prisma.user.findMany({
      where: {
        id: {
          in: newMemberIds,
        }
      },
      select: {
        id: true,
        username: true,
        name: true,
      }
    });

    // Add the members
    const createdMembers = await prisma.$transaction(
      usersToAdd.map(user => 
        prisma.groupMember.upsert({
          where: {
            groupId_userId: {
              groupId,
              userId: user.id,
            }
          },
          update: {
            status: 'ACTIVE',
            leftAt: null,
          },
          create: {
            groupId,
            userId: user.id,
            username: user.username,
            displayName: user.name,
            status: 'ACTIVE',
          }
        })
      )
    );

    revalidatePath(`/groups/${groupId}`);

    return {
      success: true,
      addedCount: createdMembers.length,
      skippedCount: memberIds.length - createdMembers.length,
    };
  } catch (error) {
    console.error("Failed to add members to the group: ", error)
    return {
      success: false,
      error: GROUP_ERRORS.ADD_MEMBER_FAILED,
    }
  }
}

interface RemoveGroupMemberParams {
  groupId: string;
  memberId: string;
  currentUserId: string;
}

export async function removeGroupMember({
  groupId,
  memberId,
  currentUserId
}: RemoveGroupMemberParams) {
  try {
    // Check if the current user is a member of the group
    const currentUserMembership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: currentUserId,
        }
      },
      select: { status: true }
    });

    if (!currentUserMembership || currentUserMembership.status !== 'ACTIVE') {
      return {
        success: false,
        error: GROUP_ERRORS.UNAUTHORIZED,
      };
    }

    const memberToRemove = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: memberId,
        }
      }
    });

    if (!memberToRemove || memberToRemove.status !== 'ACTIVE') {
      return {
        success: false,
        error: GROUP_ERRORS.MEMBER_NOT_FOUND,
      };
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { ownerId: true }
    });

    if (!group) {
      return {
        success: false,
        error: GROUP_ERRORS.NOT_FOUND,
      };
    }
    
    if (memberId === group.ownerId) {
      return {
        success: false,
        error: GROUP_ERRORS.CANNOT_REMOVE_OWNER,
      };
    }

    const updateMember = await prisma.groupMember.update({
      where: { 
        id: memberToRemove.id
       },
       data: {
        status: 'LEFT',
        leftAt: new Date()
       }
    });

    revalidatePath(`/groups/${groupId}`);
    revalidatePath(`/groups/${groupId}/settings`);

    return {
      success: true,
      member: updateMember
    };
  } catch (error) {
    console.error("Failed to remove group member: ", error);
    return {
      success: false,
      error: GROUP_ERRORS.REMOVE_MEMBER_FAILED,
    }
  }
}
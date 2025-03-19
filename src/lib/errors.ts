export const FRIEND_ERRORS = {
  ALREADY_FRIENDS: 'ALREADY_FRIENDS',
  PENDING_INVITATION: 'PENDING_INVITATION',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  GENERAL_ERROR: 'GENERAL_ERROR'
} as const;

export const FRIEND_ERROR_MESSAGES = {
  [FRIEND_ERRORS.ALREADY_FRIENDS]: "This user is already on your friends list.",
  [FRIEND_ERRORS.PENDING_INVITATION]: "You have already sent an invitation to this user.",
  [FRIEND_ERRORS.EMAIL_SEND_FAILED]: "Failed to send invitation email. Please try again.",
  [FRIEND_ERRORS.GENERAL_ERROR]: "Something went wrong. Please try again."
} as const;

export const INVITE_ERRORS = {
  INVALID_TOKEN: 'INVALID_TOKEN',
  INVITATION_EXPIRED: 'INVITATION_EXPIRED',
  INVITATION_ALREADY_USED: 'INVITATION_ALREADY_USED',
  VALIDATION_ERROR: 'VALIDATION_ERROR'
} as const;

export const INVITE_ERROR_MESSAGES = {
  [INVITE_ERRORS.INVALID_TOKEN]: "This invitation link is invalid.",
  [INVITE_ERRORS.INVITATION_EXPIRED]: "This invitation has expired",
  [INVITE_ERRORS.INVITATION_ALREADY_USED]: "This invitation has already been used",
  [INVITE_ERRORS.VALIDATION_ERROR]: "There was an error validating you invitation",
}

export const INVITATION_ERRORS = {
  INVALID_OR_EXPIRED: 'INVALID_OR_EXPIRED',
  FAILED_TO_PROCESS: 'FAILED_TO_PROCESS'
} as const;

export const GROUP_ERRORS = {
  CREATION_FAILED: 'CREATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FETCH_FAILED: 'FETCH_FAILED',
  GENERAL_ERROR: 'GENERAL_ERROR',
  UPDATE_FAILED: 'UPDATE_FAILED,',
  DELETE_FAILED: 'DELETE_FAILED',
  ADD_MEMBER_FAILED: 'ADD_MEMBER_FAILED',
  MEMBER_ALREADY_EXISTS: 'MEMBER_ALREADY_EXISTS',
} as const

export const GROUP_ERROR_MESSAGES = {
  [GROUP_ERRORS.CREATION_FAILED]: "Failed to create group",
  [GROUP_ERRORS.NOT_FOUND]: "Group not found",
  [GROUP_ERRORS.UNAUTHORIZED]: "You are not authorized to view this group",
  [GROUP_ERRORS.FETCH_FAILED]: "Faied to fetch user groups",
  [GROUP_ERRORS.GENERAL_ERROR]: "Something went wrong with this group",
  [GROUP_ERRORS.UPDATE_FAILED]: "Failed to update group",
  [GROUP_ERRORS.DELETE_FAILED]: "Failed to delete group",
  [GROUP_ERRORS.ADD_MEMBER_FAILED]: "Failed to add user to the group",
  [GROUP_ERRORS.MEMBER_ALREADY_EXISTS]: "User is already in the group",
} as const;
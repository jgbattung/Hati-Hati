export const FRIEND_ERRORS = {
  ALREADY_FRIENDS: 'ALREADY_FRIENDS',
  PENDING_INVITATION: 'PENDING_INVITATION',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  GENERAL_ERROR: 'GENERAL_ERROR'
} as const;

export const ERROR_MESSAGES = {
  [FRIEND_ERRORS.ALREADY_FRIENDS]: "This user is already on your friends list.",
  [FRIEND_ERRORS.PENDING_INVITATION]: "You have already sent an invitation to this user.",
  [FRIEND_ERRORS.EMAIL_SEND_FAILED]: "Failed to send invitation email. Please try again.",
  [FRIEND_ERRORS.GENERAL_ERROR]: "Something went wrong. Please try again."
} as const;
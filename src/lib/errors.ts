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
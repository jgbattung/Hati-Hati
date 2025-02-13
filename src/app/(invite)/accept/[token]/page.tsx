import InviteError from '@/components/invite/InviteError'
import InviteWelcome from '@/components/invite/InviteWelcome'
import { validateInviteToken } from '@/lib/actions/user.actions'
import { INVITE_ERRORS } from '@/lib/errors'
import React from 'react'

interface InvitePageProps {
  params: {
    token: string,
  }
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const result = await validateInviteToken(params.token);

  if ('error' in result) {
    return <InviteError error={result.error as keyof typeof INVITE_ERRORS} />
  }

  return (
    <div>
      <InviteError error={'INVITATION_EXPIRED'} />
      <InviteWelcome inviterName={result.invitation.invitedBy!} />
    </div>
  )
}

export default InvitePage
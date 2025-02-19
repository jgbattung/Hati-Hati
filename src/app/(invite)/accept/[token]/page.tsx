import InviteError from '@/components/invite/InviteError'
import InviteWelcome from '@/components/invite/InviteWelcome'
import { validateInviteToken } from '@/lib/actions/user.actions'
import { INVITE_ERRORS } from '@/lib/errors'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';import React from 'react'

interface InvitePageProps {
  params: {
    token: string,
  }
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const user = await currentUser();

  if (user) {
    redirect('/groups');
  }

  const result = await validateInviteToken(params.token);

  if ('error' in result) {
    return <InviteError error={result.error as keyof typeof INVITE_ERRORS} />
  }

  return (
    <div>
      <InviteWelcome
        inviterName={result.invitation.invitedBy!}
        token={params.token}
        email={result.invitation.email!}
      />
    </div>
  )
}

export default InvitePage
import InviteError from '@/components/invite/InviteError'
import React from 'react'

const page = () => {
  return (
    <div>
      <InviteError error={'INVITATION_EXPIRED'} />
    </div>
  )
}

export default page
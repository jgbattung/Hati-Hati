import { SignedOut, SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    <div>
      <SignedOut>
        <SignUp />
      </SignedOut>
    </div>  )
}

export default SignUpPage
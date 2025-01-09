import { SignedOut, SignIn } from '@clerk/nextjs'
import React from 'react'

const SignInPage = () => {
  return (
    <div>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </div>
  )
}

export default SignInPage
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const Landing = () => {
  return (
    <div className='flex gap-4 flex-col items-center justify-center h-screen'>
      <div>
        <p>LOGO</p>
      </div>
      <div className='flex flex-col items-center justify-center gap-4'>
        <Button asChild>
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}

export default Landing
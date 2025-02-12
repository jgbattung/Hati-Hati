import { INVITE_ERROR_MESSAGES, INVITE_ERRORS } from '@/lib/errors'
import Link from 'next/link';
import React from 'react'
import { Button } from '../ui/button';
import Image from 'next/image'
import somethingWentWrong from '../../public/assets/something-went-wrong.svg'

interface InviteErrorProps {
  error: keyof typeof INVITE_ERRORS;
}

const InviteError = ({ error }: InviteErrorProps) => {
  return (
    <div className='h-dvh w-full flex flex-col items-center justify-center px-8 gap-12'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <Image
          src={somethingWentWrong}
          alt="something-went-wrong"
          width={200}
          height={200}
        />
        <div className='flex flex-col items-center justify-center gap-4 mt-5'>
          <h1 className='text-2xl font-bold'>Something went wrong</h1>
          <p className='text-zinc-400 text-sm'>{INVITE_ERROR_MESSAGES[error]}</p> 
        </div>
      </div>
      <div className='flex flex-col items-center justify-center mt-5 gap-4'>
        <p className='text-center text-zinc-400 font-light text-sm'>
          {`Don't worry - you can still create an account with Hati-hati through the sign-up link below.`}
        </p>
        <div className='flex flex-col items-center justify-center w-full mt-4'>
          <Link href="/sign-up" className='w-full'>
            <Button className='px-4 py-2 w-full rounded-md bg-violet-500 hover:bg-violet-600'>
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InviteError
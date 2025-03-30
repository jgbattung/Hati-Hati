"use client"

import React, { useEffect } from 'react'
import inviteSuccess from "../../public/assets/invite-success.svg"
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '../ui/button'
import { inviteWelcomePageTestIds } from '@/utils/constants'

interface InviteWelcomeProps {
  inviterName: string;
  token: string;
  email: string;
  groupId?: string | null;
}

const InviteWelcome = ({ inviterName, token, email, groupId }: InviteWelcomeProps) => {
  useEffect(() => {
    sessionStorage.setItem('inviteData', JSON.stringify({
      token,
      email,
      inviterName,
      groupId: groupId || null,
    }));
  }, [token, email, inviterName, groupId]);

  return (
    <div 
      data-testid={inviteWelcomePageTestIds.inviteWelcomePage}
      className='h-dvh w-full flex flex-col items-center justify-center px-8 gap-12'
    >
      <div className='flex flex-col items-center justify-center gap-4'>
        <Image
          src={inviteSuccess}
          alt="something-went-wrong"
          width={200}
          height={200}
        />
        <div className='flex flex-col items-center justify-center gap-4 mt-5 text-center'>
          <h1 className='text-2xl font-bold'>{`You've been invited to join Hati-Hati!`}</h1>
          <p className='text-zinc-400 text-sm'>{`${inviterName} has invited you to join their group in Hati-Hati. Hati-Hati helps you share and split expenses with friends easily.`}</p> 
          <p className='text-zinc-400 text-sm'></p> 
        </div>
      </div>
      <div className='flex flex-col w-full items-center justify-center mt-5 gap-4'>
        <p className='text-center text-zinc-400 font-light text-sm'>
          {`Join ${inviterName} and start sharing expenses.`}
        </p>
        <div className='flex flex-col items-center justify-center w-full mt-4'>
          <Link data-testid={inviteWelcomePageTestIds.signUpButtonLink}  href="/sign-up" className='w-full'>
            <Button className='px-4 py-2 w-full rounded-md bg-violet-500 hover:bg-violet-600'>
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default InviteWelcome
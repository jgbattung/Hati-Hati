"use client"

import { headerTestIds } from '@/utils/constants'
import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

interface HeaderProps {
  headerTitle?: string;
}

const Header = ({ headerTitle }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isSettingsPage = pathname.endsWith('/settings');

  return (
    <section
      data-testid={headerTestIds.header}
      className='fixed top-0 w-full bg-transparent z-50 py-4 h-14'
    >
      <div className='flex items-center justify-between px-4'>
        <div className='flex items-center justify-center gap-3'>
          <button
            data-testid={headerTestIds.backButton}
            onClick={() => router.back()}
            className='hover:text-zinc-300 transition-colors'
          >
            <ArrowLeft size={22} />
          </button>
          {isSettingsPage && headerTitle && (
            <p className='font-light text-lg'>{headerTitle}</p>
          )}
        </div>
        {!isSettingsPage && (
          <Link
            data-testid={headerTestIds.settingsButton}
            href={`${pathname}/settings`}
            className='hover:text-zinc-300 transition-colors'
          >
            <Settings size={22} />
          </Link>
        )}
      </div>
    </section>
  )
}

export default Header
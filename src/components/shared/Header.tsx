"use client"

import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <section className='fixed top-0 w-full bg-transparent z-50 py-4 h-14'>
      <div className='flex items-center justify-between px-4'>
        <button
          onClick={() => router.back()}
          className='hover:text-zinc-300 transition-colors'
        >
          <ArrowLeft size={22} />
        </button>
        <Link
          href={`${pathname}/settings`}
          className='hover:text-zinc-300 transition-colors'
        >
          <Settings size={22} />
        </Link>
      </div>
    </section>
  )
}

export default Header
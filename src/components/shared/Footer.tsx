"use client"

import { footerRoutes } from '@/constants'
import { footerTestIds } from '@/utils/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Footer = () => {
  const currentPathname = usePathname();

  return (
    <section
      data-testid={footerTestIds.footer}
      className='fixed bottom-0 w-full bg-zinc-900 border-t-2 border-gray-500 p-4'
    >
      <div className='flex items-center justify-around gap-3'>
        {footerRoutes.map((route) => {
          const isActive = (currentPathname.includes(route.route) && route.route.length > 1) || currentPathname === route.route
          const Icon = route.icon

          return (
            <Link
              href={route.route}
              key={route.text}
              className={`flex flex-col items-center justify-center gap-2 ${isActive ? 'text-teal-600' : 'text-zinc-50 hover:text-teal-600'}`}
            >
              <Icon 
                data-testid={`icon-${route.iconId}`}
                size={20}
              />
              <p className='text-xs'>{route.text}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Footer
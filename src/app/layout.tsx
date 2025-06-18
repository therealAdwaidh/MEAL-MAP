// app/layout.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import { FoodProvider } from '@/context/FoodContext'
import { UserImageProvider } from '@/context/UserImageContext'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>

        <SessionProvider>
          <FoodProvider>
           <UserImageProvider>
              {children}
            </UserImageProvider>
          </FoodProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

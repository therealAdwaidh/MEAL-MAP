// app/layout.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'
import { FoodProvider } from '@/context/FoodContext'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>

        <SessionProvider>
          <FoodProvider>
          {children}
          </FoodProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

'use client'

import { SessionProvider } from 'next-auth/react'
import { AchievementProvider } from './AchievementProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AchievementProvider>
        {children}
      </AchievementProvider>
    </SessionProvider>
  )
}
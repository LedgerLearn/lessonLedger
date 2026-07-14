'use client'

import { SessionProvider } from 'next-auth/react'
import { AchievementProvider } from './AchievementProvider'
import { ToastProvider } from './ToastProvider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <AchievementProvider>
          {children}
        </AchievementProvider>
      </ToastProvider>
    </SessionProvider>
  )
}
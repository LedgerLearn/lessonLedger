import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import { DarkModeProvider } from '@/components/DarkModeProvider'

export const metadata: Metadata = {
  title: 'Academic Accountability Platform',
  description: 'Track your learning journey with structured roadmaps and blockchain-verified achievements',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <DarkModeProvider>
          <Providers>
            {children}
          </Providers>
        </DarkModeProvider>
      </body>
    </html>
  )
}

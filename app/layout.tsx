import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'psychiatry_booking_nextjs',
  description: 'A minimal Next.js + Tailwind starter for psychiatry booking',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  )
}

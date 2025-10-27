import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Appointment Caller',
  description: 'AI-powered appointment scheduling assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

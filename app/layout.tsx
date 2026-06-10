import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/nav-bar'

export const metadata: Metadata = {
  title: 'Employee Directory',
  description: 'View and manage active employees',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <NavBar />
        {children}
      </body>
    </html>
  )
}

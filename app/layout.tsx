import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

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
      <body>
        <nav className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-gray-900 hover:text-blue-600">
              Employee Directory
            </Link>
            <Link href="/departments" className="text-sm text-gray-500 hover:text-blue-600">
              Departments
            </Link>
            <Link href="/tickets" className="text-sm text-gray-500 hover:text-blue-600">
              Tickets
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}

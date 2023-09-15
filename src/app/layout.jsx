import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import Provider from '@/components/Provider'

export const metadata = {
  title: {
    template: '%s - PartSoft',
    default: 'PartSoft - Efficient Truck Parts Ordering for Shops',
  },
  description:
  'Finding the right truck parts can be cumbersome. PartSoft streamlines the process, ensuring shops get what they need quickly and accurately.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <Provider>
        <body className="flex h-full flex-col">{children}</body>
      </Provider>
    </html>
  )
}

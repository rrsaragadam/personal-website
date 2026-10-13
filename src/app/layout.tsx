import type { Metadata } from 'next'
import { Caveat, Geist, Geist_Mono, Permanent_Marker } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// The journal's handwriting, and a marker for the odd shouted heading.
const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
})

const marker = Permanent_Marker({
  variable: '--font-marker',
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Rishi Saragadam — Field Log',
  description:
    'Product designer. Everything I’m making, reading and hiking, kept in one notebook.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Font variables live on <html> so the @theme tokens and the canvas
    // painters can resolve them.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${marker.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

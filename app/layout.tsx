import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ReformaApp — Gestão de Obras',
  description: 'Controle financeiro rigoroso para suas obras e reformas',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#18181B',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-zinc-900 text-zinc-100 min-h-screen">
        {children}
      </body>
    </html>
  )
}

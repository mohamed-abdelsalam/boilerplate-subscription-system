import './globals.css';

export const metadata = {
  title: 'BSS System',
  description: 'Boilerplate Subscription System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}

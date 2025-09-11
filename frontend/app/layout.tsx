import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-DE">
      <body>{children}</body>
    </html>
  )
}
// app/layout.tsx
'use client';

import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

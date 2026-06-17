'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode; // children prop is of type React.ReactNode, which can be any valid React child (string, number, element, fragment, etc.)
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
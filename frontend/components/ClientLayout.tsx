'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

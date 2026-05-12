import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/shared/context/SidebarContext';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import AppShell from '@/shared/components/layout/AppShell';

const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              <AppShell>{children}</AppShell>
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

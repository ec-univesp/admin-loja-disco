import { Outfit } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/shared/context/SidebarContext';
import { ThemeProvider } from '@/shared/context/ThemeContext';
import { AppStoreInitializer } from '@/shared/store/AppStoreInitializer';
import AppShell from '@/shared/components/layout/AppShell';

const outfit = Outfit({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <AppStoreInitializer />
        <ThemeProvider>
          <SidebarProvider>
            <AppShell>{children}</AppShell>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

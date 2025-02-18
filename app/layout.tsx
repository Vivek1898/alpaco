import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Sidebar } from '@/components/sidebar';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  icons:"/fav.png",
  title: 'Crypto Market Intelligence',
  description: 'Real-time crypto market analysis and insights platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/*<div className="flex h-screen overflow-hidden">*/}
            {/*<Sidebar />*/}
            {/*<div className="flex-1 overflow-auto">*/}
              {children}
            {/*</div>*/}
          {/*</div>*/}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
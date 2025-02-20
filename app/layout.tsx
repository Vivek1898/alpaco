import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

// Define font outside of component and outside of any functions
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    icons: "/fav.png",
    title: 'Crypto Market Intelligence',
    description: 'Real-time crypto market analysis and insights platform',
}

export default function RootLayout({ children }:any) {
    return (
        <html lang="en" className={inter.className}>
        <body>
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            {children}
            <Toaster />
        </ThemeProvider>
        </body>
        </html>
    )
}
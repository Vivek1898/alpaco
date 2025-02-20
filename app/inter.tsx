// Move font initialization to the top level
// @ts-ignore
import {Inter} from "next/font/google";

// @ts-ignore
export const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
}) as const;
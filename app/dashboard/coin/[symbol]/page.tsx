// app/dashboard/coin/[symbol]/page.tsx
import dynamic from 'next/dynamic'

const CoinPageClient = dynamic(() => import('./client-page'), {
  ssr: false
})

export default function Page() {
  return <CoinPageClient />
}
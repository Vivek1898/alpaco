import { MarketOverview } from "@/components/market-overview";
import { CoinList } from "@/components/coin-list";

export default function Home() {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
                <p className="text-muted-foreground">
                    Comprehensive market overview and detailed coin analysis
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <MarketOverview compact />
            </div>

            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">Active Markets</h3>
                <CoinList />
            </div>
        </div>
    );
}
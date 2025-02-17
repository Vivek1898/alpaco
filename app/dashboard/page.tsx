import {MarketOverview} from "@/components/market-overview";
import {CoinList} from "@/components/coin-list";

export default function Home() {
    return (
        <div className="space-y-6 md:space-y-8">
            {/* Header Section */}
            <div className="px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Comprehensive market overview and detailed coin analysis
                </p>
            </div>

            {/* Market Overview Grid */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                    <MarketOverview compact />
                </div>
            </div>

            {/* Active Markets Section */}
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl sm:text-2xl font-semibold">Active Markets</h3>
                    </div>
                    <div className="bg-background rounded-lg border shadow-sm">
                        <CoinList />
                    </div>
                </div>
            </div>
        </div>
    );
}
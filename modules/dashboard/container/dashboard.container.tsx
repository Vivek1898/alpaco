import {useState} from "react";
import {NetworkSelector} from "@/components/network-selector";
import {DexTable} from "@/components/dex-table";
import {NETWORKS} from "@/lib/constants";

export default function DashboardContainer(){
    const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold">Top Cryptocurrency Decentralized Exchanges</h1>
                    <p className="text-muted-foreground">
                        Rankings of top decentralized exchanges based on trading volumes and market share of DeFi markets.
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <NetworkSelector
                        selected={selectedNetwork}
                        onSelect={setSelectedNetwork as any}
                    />
                </div>

                <DexTable networkId={selectedNetwork.id} />
            </div>
        </main>
    )
}
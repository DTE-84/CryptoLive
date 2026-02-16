import React from "react"; 
import useWatchlist from "../hooks/useWatchlist";
import useCoinGeckoPrices from "../hooks/useCoinGeckoPrices";
import useHoldings from "../hooks/useHoldings";
import WatchlistSelector from "./WatchlistSelector";
import ChartCard from "./ChartCard";

const AVAILABLE_COINS = ["bitcoin", "ethereum", "solana", "cardano", "polkadot"];

export default function DashboardGrid() {
  const [watchlist, setWatchlist] = useWatchlist();
  const { prices, loading } = useCoinGeckoPrices();
  const { holdings, updateHolding, saving } = useHoldings();

  // Calculate total net worth dynamically from server-synced holdings
  const totalValue = Object.entries(holdings).reduce((total, [id, qty]) => {
    const currentPrice = prices?.[id]?.usd || 0; 
    return total + (qty * currentPrice);
  }, 0);

  return (
    <div className="p-6 bg-[#0b0e11] min-h-screen text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* High-Fidelity Portfolio Summary */}
      <div className="max-w-7xl mx-auto mb-12 relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] group hover:border-emerald-500/30 transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${saving ? 'bg-amber-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`}></div>
              <h2 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">
                {saving ? 'Syncing_Database...' : 'Net Worth Transmission'}
              </h2>
            </div>
            <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">System_v4.2</span>
          </div>
          <div className="flex items-baseline gap-4">
             <span className="text-6xl font-bold tracking-tighter bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
               ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
             <span className="text-emerald-500 font-mono text-sm font-bold tracking-widest px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">UPLINK_LIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h3 className="text-xl font-bold tracking-tight">Active_Liquidity_Grid</h3>
          <WatchlistSelector 
            availableCoins={AVAILABLE_COINS} 
            selectedCoins={watchlist} 
            setSelectedCoins={setWatchlist} 
          />
        </div>

        {loading && watchlist.length > 0 ? (
          <div className="flex flex-col items-center justify-center mt-32">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-r-2 border-emerald-500 mb-6 relative z-10"></div>
            </div>
            <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">Establishing_Protocol...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {watchlist.map((id) => (
              <div key={id} className="transform hover:scale-[1.02] transition-all duration-300">
                <ChartCard 
                  coinId={id} 
                  price={prices?.[id]?.usd} 
                  priceChange={prices?.[id]?.usd_24h_change} 
                  qty={holdings[id] || 0}
                  onQtyChange={(newQty) => updateHolding(id, newQty)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

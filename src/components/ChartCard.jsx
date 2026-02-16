// src/components/ChartCard.jsx
export default function ChartCard({ coinId, price, priceChange, qty, onQtyChange }) {
  const holdingsValue = (qty * (price || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 });
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white/[0.02] backdrop-blur-md p-8 rounded-[24px] border border-white/5 hover:border-accent/30 transition-all duration-500 shadow-xl group/card relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] rounded-full opacity-0 group-hover/card:opacity-20 transition-opacity duration-700 ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1 block">Asset_ID</span>
          <h3 className="capitalize font-bold text-white text-xl tracking-tight">{coinId}</h3>
        </div>
        <div className={`flex flex-col items-end ${isPositive ? "text-emerald-400" : "text-rose-500"}`}>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-50 mb-1">24H_Delta</span>
          <span className="font-mono font-bold text-sm bg-current/10 px-2 py-0.5 rounded border border-current/20">
            {isPositive ? "+" : ""}{priceChange?.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="mb-10 relative z-10">
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1 block">Market_Value</span>
        <p className="text-3xl font-bold text-white tracking-tighter">${price?.toLocaleString() || "---"}</p>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-emerald-500/50"></span>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Holdings_Equity: <span className="text-white">${holdingsValue}</span></p>
        </div>
      </div>

      {/* EDITABLE INPUT */}
      <div className="mt-4 pt-6 border-t border-white/5 relative z-10">
        <label className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 block mb-3">Portfolio_Allocation</label>
        <div className="relative group/input">
          <input 
            type="number" 
            value={qty} 
            onChange={(e) => onQtyChange?.(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full text-white font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
            placeholder="0.00"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gray-600 uppercase tracking-widest pointer-events-none group-focus-within/input:text-emerald-500/50 transition-colors">Units</span>
        </div>
      </div>
    </div>
  );
}
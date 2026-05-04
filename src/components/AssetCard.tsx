import React from "react";

interface AssetCardProps {
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  alertThreshold: number;
}

export default function AssetCard({
  name,
  ticker,
  price,
  change24h,
  alertThreshold,
}: AssetCardProps) {
  // Defensive check: Ensure we are comparing numbers, not strings
  const isAlerting = Number(change24h) <= Number(alertThreshold);

  // Debugging inside the card - Open F12 to see this
  console.log(
    `[${ticker}] Change: ${change24h} | Threshold: ${alertThreshold} | Alert: ${isAlerting}`,
  );

  return (
    <div
      className={`relative p-6 rounded-xl bg-gray-900 border transition-all duration-500 ${
        isAlerting
          ? "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-red-950/10"
          : "border-gray-800 hover:border-gray-700"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {name}
          </h2>
          <span className="text-sm text-gray-400 font-medium">
            {ticker.toUpperCase()}
          </span>
        </div>

        {isAlerting && (
          <div className="flex flex-col items-end">
            <span className="px-2 py-1 text-[10px] font-black text-red-400 bg-red-400/10 border border-red-400/20 rounded-full animate-pulse uppercase tracking-widest">
              Threshold Breached
            </span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-3xl font-mono text-white tracking-tighter">
          $
          {price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        <p
          className={`text-sm font-bold mt-2 flex items-center ${change24h < 0 ? "text-red-400" : "text-green-400"}`}
        >
          {change24h < 0 ? "▼" : "▲"} {Math.abs(change24h).toFixed(2)}%
          <span className="text-gray-500 text-[10px] ml-2 font-normal">
            (24H)
          </span>
        </p>
      </div>

      {/* Visual background indicator for high-stress situations */}
      {isAlerting && (
        <div className="absolute inset-0 bg-red-500/5 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}

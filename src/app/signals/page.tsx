"use client";
import { useState } from "react";

// The Upgraded Financial Engine: Complete Quantitative Profiles
const riskProfiles: Record<
  string,
  { tpTarget: number; slFloor: number; rung2: number; rung3: number }
> = {
  // tpTarget: % above Average Price
  // slFloor: % below Final Rung
  // rung2 & rung3: % drop from Initial Market Price
  BTC: { tpTarget: 3.0, slFloor: 1.5, rung2: 1.5, rung3: 3.5 },
  ETH: { tpTarget: 4.0, slFloor: 2.0, rung2: 2.0, rung3: 4.5 },
  SOL: { tpTarget: 6.0, slFloor: 3.0, rung2: 3.0, rung3: 6.0 },
  DOGE: { tpTarget: 10.0, slFloor: 5.0, rung2: 5.0, rung3: 10.0 },
  SHIB: { tpTarget: 12.0, slFloor: 6.0, rung2: 6.0, rung3: 12.0 },
  PEPE: { tpTarget: 20.0, slFloor: 10.0, rung2: 10.0, rung3: 20.0 },
  WIF: { tpTarget: 20.0, slFloor: 10.0, rung2: 10.0, rung3: 20.0 },
};

export default function SignalsPage() {
  const [budget, setBudget] = useState<number>(15);
  const [asset, setAsset] = useState<string>("BTC");
  const [currentPrice, setCurrentPrice] = useState<number>(98000); // Default placeholder

  const profile = riskProfiles[asset];

  // --- 1. THE LADDER DOLLAR ALLOCATION ---
  const budget1 = budget * 0.3;
  const budget2 = budget * 0.3;
  const budget3 = budget * 0.4;

  // --- 2. THE LADDER PRICE TARGETS ---
  const price1 = currentPrice;
  const price2 = currentPrice * (1 - profile.rung2 / 100);
  const price3 = currentPrice * (1 - profile.rung3 / 100);

  // --- 3. TRUE AVERAGE ENTRY CALCULATION ---
  // To find the true average, we divide total money spent by total coins bought
  const coins1 = budget1 / price1;
  const coins2 = budget2 / price2;
  const coins3 = budget3 / price3;
  const totalCoins = coins1 + coins2 + coins3;

  const avgEntryPrice = budget / totalCoins;

  // --- 4. THE RISK BOUNDARIES ---
  // TP is calculated UP from the Average
  const takeProfitPrice = avgEntryPrice * (1 + profile.tpTarget / 100);
  // SL is calculated DOWN from the Final Rung
  const stopLossPrice = price3 * (1 - profile.slFloor / 100);

  // Helper to format prices cleanly (small coins get decimals, big coins get commas)
  const formatDollar = (num: number) =>
    num < 1
      ? num.toFixed(6)
      : num.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8 md:p-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tighter text-white uppercase">
            Klassic Command Center
          </h1>
          <p className="text-gray-400 mt-2">Quantitative DCA & Risk Engine</p>
        </header>

        {/* INPUT PANEL */}
        <section className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Total Capital ($)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Target Asset
              </label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
              >
                {Object.keys(riskProfiles).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-blue-400 font-bold uppercase tracking-widest block mb-2">
                Watchman Current Price ($)
              </label>
              <input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-full bg-black border border-blue-900 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* OUTPUT PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* THE ENTRY LADDER */}
          <div className="border border-gray-800 rounded-lg bg-black p-6">
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-widest text-sm text-gray-400">
              Entry Execution
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded border-l-4 border-gray-500">
                <div>
                  <p className="text-sm font-bold text-white">
                    Market Buy (30%)
                  </p>
                  <p className="text-xs text-gray-400">
                    Spend ${budget1.toFixed(2)}
                  </p>
                </div>
                <div className="text-lg font-mono text-white">
                  ${formatDollar(price1)}
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded border-l-4 border-yellow-500">
                <div>
                  <p className="text-sm font-bold text-white">
                    Limit Buy 1 (30%)
                  </p>
                  <p className="text-xs text-gray-400">
                    Spend ${budget2.toFixed(2)} (-{profile.rung2}%)
                  </p>
                </div>
                <div className="text-lg font-mono text-yellow-400">
                  ${formatDollar(price2)}
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded border-l-4 border-orange-500">
                <div>
                  <p className="text-sm font-bold text-white">
                    Limit Buy 2 (40%)
                  </p>
                  <p className="text-xs text-gray-400">
                    Spend ${budget3.toFixed(2)} (-{profile.rung3}%)
                  </p>
                </div>
                <div className="text-lg font-mono text-orange-400">
                  ${formatDollar(price3)}
                </div>
              </div>

              <div className="mt-6 p-3 bg-blue-900/20 border border-blue-900 rounded flex justify-between items-center">
                <span className="text-sm text-blue-400 font-bold uppercase">
                  True Average Entry:
                </span>
                <span className="text-lg font-mono text-blue-400">
                  ${formatDollar(avgEntryPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* THE RISK STRATEGY */}
          <div className="border border-gray-800 rounded-lg bg-black p-6">
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-widest text-sm text-gray-400">
              Automated Exits
            </h3>
            <div className="space-y-4">
              {/* Take Profit */}
              <div className="p-4 bg-gray-900 rounded border border-green-900/50 flex flex-col items-center text-center">
                <span className="text-xs text-green-500 uppercase tracking-widest mb-1">
                  Take Profit Limit
                </span>
                <span className="text-3xl font-mono text-green-400">
                  ${formatDollar(takeProfitPrice)}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  Anchored +{profile.tpTarget}% above average entry.
                </p>
              </div>

              {/* Stop Loss */}
              <div className="p-4 bg-gray-900 rounded border border-red-900/50 flex flex-col items-center text-center">
                <span className="text-xs text-red-500 uppercase tracking-widest mb-1">
                  Hard Stop Loss
                </span>
                <span className="text-3xl font-mono text-red-400">
                  ${formatDollar(stopLossPrice)}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  Anchored safely -{profile.slFloor}% below final rung.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

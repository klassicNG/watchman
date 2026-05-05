"use client";
import { useState } from "react";

export default function SignalsPage() {
  const [budget, setBudget] = useState<number>(15);
  const [asset, setAsset] = useState<string>("BTC");
  const [strategy, setStrategy] = useState<"BUY" | "SELL">("BUY");

  // The Math behind the "Signal"
  const entry1 = (budget * 0.3).toFixed(2);
  const entry2 = (budget * 0.3).toFixed(2);
  const entry3 = (budget * 0.4).toFixed(2);

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8 md:p-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="border-b border-gray-800 pb-6">
          <h1 className="text-4xl font-bold tracking-tighter text-white uppercase">
            Signal Execution
          </h1>
          <p className="text-gray-400 mt-2">
            Capital Allocation & Risk Management Engine
          </p>
        </header>

        <section className="bg-gray-900/60 p-6 rounded-xl border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Budget Input */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Total Capital ($)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none"
              />
            </div>

            {/* Asset Select */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Target Asset
              </label>
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:border-green-500 focus:outline-none"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="PEPE">Pepe (PEPE)</option>
              </select>
            </div>

            {/* Action Select */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">
                Signal Directive
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setStrategy("BUY")}
                  className={`flex-1 py-3 rounded-lg font-bold transition-colors ${strategy === "BUY" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400"}`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setStrategy("SELL")}
                  className={`flex-1 py-3 rounded-lg font-bold transition-colors ${strategy === "SELL" ? "bg-red-600 text-white" : "bg-gray-800 text-gray-400"}`}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>

          {/* The Output Signal */}
          <div className="border border-gray-800 rounded-lg bg-black p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recommended {strategy} Ladder for ${budget}
            </h3>

            <div className="space-y-4">
              {/* Ladder Step 1 */}
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded border-l-4 border-yellow-500">
                <div>
                  <p className="text-sm font-bold text-white">
                    Tier 1: Immediate Market Execution
                  </p>
                  <p className="text-xs text-gray-400">
                    Deploy 30% of capital at current price
                  </p>
                </div>
                <div className="text-xl font-mono text-yellow-400">
                  ${entry1}
                </div>
              </div>

              {/* Ladder Step 2 */}
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded border-l-4 border-orange-500">
                <div>
                  <p className="text-sm font-bold text-white">
                    Tier 2: Limit Order (-2% Drop)
                  </p>
                  <p className="text-xs text-gray-400">
                    Deploy 30% of capital if price bleeds
                  </p>
                </div>
                <div className="text-xl font-mono text-orange-400">
                  ${entry2}
                </div>
              </div>

              {/* Ladder Step 3 */}
              <div className="flex justify-between items-center p-3 bg-gray-900 rounded border-l-4 border-red-500">
                <div>
                  <p className="text-sm font-bold text-white">
                    Tier 3: Limit Order (-5% Crash)
                  </p>
                  <p className="text-xs text-gray-400">
                    Deploy 40% of capital to catch the bottom
                  </p>
                </div>
                <div className="text-xl font-mono text-red-400">${entry3}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

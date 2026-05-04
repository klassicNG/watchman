"use client";
import { useState, useEffect } from "react";
import AssetCard from "@/components/AssetCard";
// THE MISSING LINK: Importing our Telegram utility
import { sendTelegramAlert } from "@/lib/telegram";

interface Asset {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change24h: number;
}

export default function Home() {
  const [threshold, setThreshold] = useState<number>(-5.0);
  const [marketData, setMarketData] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Anti-spam state: prevents the bot from texting you every 30 seconds
  const [hasAlerted, setHasAlerted] = useState<boolean>(false);

  useEffect(() => {
    const fetchLiveMarketData = async () => {
      try {
        const url =
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,cardano,chainlink,polygon&vs_currencies=usd&include_24hr_change=true";
        const response = await fetch(url);
        const data = await response.json();

        const formattedData: Asset[] = [
          {
            id: "bitcoin",
            name: "Bitcoin",
            ticker: "BTC",
            price: data.bitcoin.usd,
            change24h: data.bitcoin.usd_24h_change,
          },
          {
            id: "ethereum",
            name: "Ethereum",
            ticker: "ETH",
            price: data.ethereum.usd,
            change24h: data.ethereum.usd_24h_change,
          },
          {
            id: "solana",
            name: "Solana",
            ticker: "SOL",
            price: data.solana.usd,
            change24h: data.solana.usd_24h_change,
          },
          {
            id: "binancecoin",
            name: "BNB",
            ticker: "BNB",
            price: data.binancecoin.usd,
            change24h: data.binancecoin.usd_24h_change,
          },
          {
            id: "cardano",
            name: "Cardano",
            ticker: "ADA",
            price: data.cardano.usd,
            change24h: data.cardano.usd_24h_change,
          },
          {
            id: "chainlink",
            name: "Chainlink",
            ticker: "LINK",
            price: data.chainlink.usd,
            change24h: data.chainlink.usd_24h_change,
          },
        ];

        setMarketData(formattedData);
        setIsLoading(false);

        // --- WATCHMAN LOGIC START ---
        const btc = formattedData.find((a) => a.id === "bitcoin");

        // If Bitcoin is below threshold AND we haven't sent a text yet
        if (btc && btc.change24h <= threshold && !hasAlerted) {
          const msg = `🚨 <b>WATCHMAN ALERT</b> 🚨\n\n<b>BTC</b> has breached your <b>${threshold}%</b> threshold!\n\nCurrent Price: $${btc.price.toLocaleString()}\nChange: ${btc.change24h.toFixed(2)}%`;

          await sendTelegramAlert(msg);
          setHasAlerted(true); // Lock the alarm
        }

        // If Bitcoin recovers above the threshold, reset the alarm lock
        if (btc && btc.change24h > threshold && hasAlerted) {
          setHasAlerted(false);
          console.log("Market recovered. Resetting Watchman alert lock.");
        }
        // --- WATCHMAN LOGIC END ---
      } catch (error) {
        console.error("Watchman Fetch Failed:", error);
        setIsLoading(false);
      }
    };

    fetchLiveMarketData();
    const interval = setInterval(fetchLiveMarketData, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [threshold, hasAlerted]); // We add threshold here so the logic re-runs when you move the slider

  return (
    <main className="min-h-screen bg-black text-gray-100 p-8 md:p-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="border-b border-gray-800 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-white uppercase">
              Watchman
            </h1>
            <p className="text-gray-400 mt-2">
              Autonomous Market Reconnaissance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-gray-500 uppercase">
              System Status:
            </span>
            <span
              className={`w-3 h-3 rounded-full ${isLoading ? "bg-yellow-500 animate-pulse" : "bg-green-500 shadow-[0_0_10px_#22c55e]"}`}
            ></span>
          </div>
        </header>

        <section className="bg-gray-900/40 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
          <div className="flex justify-between mb-6">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Alert Sensitivity
            </label>
            <span className="text-xl font-mono text-white">
              {threshold > 0 ? "+" : ""}
              {threshold}%
            </span>
          </div>
          <input
            type="range"
            min="-10"
            max="10"
            step="0.5"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <p className="text-[10px] text-gray-600 mt-4 uppercase tracking-tighter">
            Adjust slider to test phone notification (Set above current price
            change)
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {marketData.map((asset) => (
            <AssetCard key={asset.id} {...asset} alertThreshold={threshold} />
          ))}
        </section>
      </div>
    </main>
  );
}

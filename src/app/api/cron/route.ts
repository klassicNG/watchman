import { NextResponse } from "next/server";
import { sendTelegramAlert } from "@/lib/telegram";

export async function GET(request: Request) {
  try {
    // SECURITY CHECK
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 },
      );
    }

    // 1. THE ASSET RISK PROFILES (The new custom thresholds)
    const targetAssets = [
      // THE MAJORS: Tight thresholds because they move slower
      { id: "bitcoin", ticker: "BTC", buyDip: -2.0, takeProfit: 3.0 },
      { id: "ethereum", ticker: "ETH", buyDip: -3.0, takeProfit: 4.0 },
      { id: "solana", ticker: "SOL", buyDip: -5.0, takeProfit: 6.0 },

      // THE MEMES: Extremely wide thresholds because they are chaotic
      { id: "dogecoin", ticker: "DOGE", buyDip: -8.0, takeProfit: 10.0 },
      { id: "shiba-inu", ticker: "SHIB", buyDip: -10.0, takeProfit: 12.0 },
      { id: "pepe", ticker: "PEPE", buyDip: -15.0, takeProfit: 20.0 },
      { id: "dogwifcoin", ticker: "WIF", buyDip: -15.0, takeProfit: 20.0 }, // WIF is highly volatile
    ];

    // 2. Dynamically build the CoinGecko URL based on our array
    const coinIds = targetAssets.map((asset) => asset.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("CoinGecko API Throttled or Offline");
    const data = await response.json();

    // 3. THE EXECUTION ENGINE (Using specific thresholds)
    for (const asset of targetAssets) {
      const marketData = data[asset.id];
      if (!marketData) continue; // Skip if CoinGecko didn't return data for this coin

      const change = marketData.usd_24h_change;

      // BUY SIGNAL logic using the asset's specific buyDip number
      if (change <= asset.buyDip) {
        const message =
          `🚨 <b>WATCHMAN: ${asset.ticker} BUY ZONE</b> 🚨\n\n` +
          `<b>${asset.ticker}</b> has crashed <b>${change.toFixed(2)}%</b>.\n` +
          `Target Buy Threshold: ${asset.buyDip}%\n\n` +
          `📊 <a href="https://watchman-two.vercel.app/signals">Open Klassic Command Center</a>`;

        await sendTelegramAlert(message);
      }
      // SELL SIGNAL logic using the asset's specific takeProfit number
      else if (change >= asset.takeProfit) {
        const message =
          `✅ <b>WATCHMAN: ${asset.ticker} TAKE PROFIT</b> ✅\n\n` +
          `<b>${asset.ticker}</b> is pumping! Up <b>${change.toFixed(2)}%</b>.\n` +
          `Target Sell Threshold: +${asset.takeProfit}%\n\n` +
          `💰 Secure your gains.`;

        await sendTelegramAlert(message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Watchman patrol complete with custom risk profiles.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Cron Failed" },
      { status: 500 },
    );
  }
}

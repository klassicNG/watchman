import { NextResponse } from "next/server";
import { sendTelegramAlert } from "@/lib/telegram";

export async function GET() {
  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,cardano,chainlink&vs_currencies=usd&include_24hr_change=true";
    const response = await fetch(url);
    const data = await response.json();

    const threshold = -7.0; // Hardcoded "Blood in the Streets" threshold
    const assets = [
      { id: "bitcoin", ticker: "BTC" },
      { id: "ethereum", ticker: "ETH" },
      { id: "solana", ticker: "SOL" },
    ];

    for (const asset of assets) {
      const change = data[asset.id].usd_24h_change;
      if (change <= threshold) {
        await sendTelegramAlert(
          `🚨 <b>CRASH DETECTED</b>: ${asset.ticker} is down ${change.toFixed(2)}%!`,
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Cron Failed" },
      { status: 500 },
    );
  }
}

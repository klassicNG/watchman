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

    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,cardano,chainlink&vs_currencies=usd&include_24hr_change=true";
    const response = await fetch(url);
    const data = await response.json();

    const threshold = -5.0; // Your target threshold
    const assets = [
      { id: "bitcoin", ticker: "BTC" },
      { id: "ethereum", ticker: "ETH" },
      { id: "solana", ticker: "SOL" },
      { id: "binancecoin", ticker: "BNB" },
      { id: "cardano", ticker: "ADA" },
      { id: "chainlink", ticker: "LINK" },
    ];

    for (const asset of assets) {
      const change = data[asset.id].usd_24h_change;

      if (change <= threshold) {
        // THE UPDATED MESSAGE FORMAT WITH THE LINK
        const message =
          `🚨 <b>WATCHMAN SIGNAL: STRONG BUY</b> 🚨\n\n` +
          `<b>${asset.ticker}</b> is heavily oversold (Down ${change.toFixed(2)}%).\n` +
          `Historically, this indicates a mean-reversion bounce.\n\n` +
          `📊 <b>Action Hub:</b> <a href="https://watchman-two.vercel.app/signals">Open Dashboard</a>`;

        await sendTelegramAlert(message);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Watchman patrol complete.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Cron Failed" },
      { status: 500 },
    );
  }
}

"use server"; // THIS IS CRUCIAL

export const sendTelegramAlert = async (message: string) => {
  // On the server, we don't need NEXT_PUBLIC_.
  // You can just use TELEGRAM_BOT_TOKEN in .env.local
  const token = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Credentials missing");
    return { success: false, error: "Missing keys" };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Telegram API Error:", errorData);
      return { success: false, error: errorData.description };
    }

    return { success: true };
  } catch (error) {
    console.error("Server-side Fetch Failed:", error);
    return { success: false, error: "Network error" };
  }
};

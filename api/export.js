import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const apiKey = "d4qveq9r01qrphacc7s0d4qveq9r01qrphacc7sg"; 
    const symbol = "XAUUSD";

    // Interwały Finnhub: resolution w minutach
    const intervals = {
      M1: "1",
      M5: "5",
      M15: "15",
      M30: "30",
      H1: "60"
    };

    let result = {};

    for (const [name, resolution] of Object.entries(intervals)) {
      const now = Math.floor(Date.now() / 1000);

      // pobieramy 200 świec → resolution * 200 * 60sek
      const from = now - (200 * parseInt(resolution) * 60);

      const url =
        `https://finnhub.io/api/v1/forex/candle?symbol=OANDA:${symbol}` +
        `&resolution=${resolution}&from=${from}&to=${now}&token=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      result[name] = data;
    }

    return res.status(200).json({
      status: "ok",
      provider: "finnhub",
      symbol,
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

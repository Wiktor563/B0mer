import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { symbol = "OANDA:XAUUSD", bars = 2000 } = req.query;

    const url = `https://api.tradingview.com/history?symbol=${symbol}&resolution=1&count=${bars}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({
      status: "ok",
      symbol,
      bars: data
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

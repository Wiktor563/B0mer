export default async function handler(req, res) {
  try {
    const symbol = "OANDA:XAUUSD";

    // przykładowy endpoint (możesz zamienić na swój, jeśli masz API)
    const url = `https://api.tradingview.com/history?symbol=${encodeURIComponent(symbol)}&resolution=1&from=1700000000&to=2000000000`;

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

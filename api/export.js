import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const symbol = "XAUUSD=X";   // Yahoo Finance symbol for Gold
    const interval = "1m";       // 1-minute candles
    const range = "7d";          // last 7 days of data

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;

    const response = await fetch(url);
    const json = await response.json();

    const result = json.chart.result[0];

    const timestamps = result.timestamp;
    const prices = result.indicators.quote[0];

    const bars = timestamps.map((t, i) => ({
      time: t,
      open: prices.open[i],
      high: prices.high[i],
      low: prices.low[i],
      close: prices.close[i],
      volume: prices.volume[i]
    }));

    res.status(200).json({
      status: "ok",
      symbol: "XAUUSD",
      timeframe: interval,
      bars: bars
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

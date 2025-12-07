const TF_MAP = {
  M1: "1m",
  M5: "5m",
  M15: "15m",
  M30: "30m",
  H1: "1h"
};

async function fetchTF(tf) {
  const interval = TF_MAP[tf];
  const url = `https://api.binance.com/api/v3/klines?symbol=XAUUSDT&interval=${interval}&limit=500`;

  const response = await fetch(url);
  const data = await response.json();

  if (!Array.isArray(data)) {
    return { error: data.msg || "Error fetching data" };
  }

  const candles = data.map(c => ({
    time: c[0],
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5])
  }));

  return { candles };
}

export default async function handler(req, res) {
  try {
    const result = {};

    for (const tf of Object.keys(TF_MAP)) {
      result[tf] = await fetchTF(tf);
    }

    return res.status(200).json({
      status: "ok",
      symbol: "XAUUSD",
      source: "binance",
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

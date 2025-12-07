const TF_MAP = {
  M1: "1min",
  M5: "5min",
  M15: "15min",
  M30: "30min",
  H1: "1h"
};

async function fetchTF(tf) {
  const interval = TF_MAP[tf];

  const url = `https://api.twelvedata.com/time_series?symbol=XAU/USD&interval=${interval}&outputsize=500&format=JSON`;

  const response = await fetch(url);
  const raw = await response.json();

  if (!raw.values) {
    return { error: raw.message || "No data" };
  }

  const candles = raw.values.map(c => ({
    time: c.datetime,
    open: parseFloat(c.open),
    high: parseFloat(c.high),
    low: parseFloat(c.low),
    close: parseFloat(c.close),
    volume: parseFloat(c.volume || 0)
  })).reverse();

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
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

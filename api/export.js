const API_KEY = "dc89542d1cb0415d86c9d4ce03e07ad0";
const SYMBOL = "XAUUSD";
const BASE_URL = "https://api.twelvedata.com/time_series";

const TF_MAP = {
  M1: "1min",
  M5: "5min",
  M15: "15min",
  M30: "30min",
  H1: "1h"
};

async function fetchTF(tf) {
  const interval = TF_MAP[tf];
  const url =
    `${BASE_URL}?symbol=${SYMBOL}` +
    `&interval=${interval}` +
    `&apikey=${API_KEY}` +
    `&outputsize=500` +
    `&format=JSON`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.status === "error" || json.code) {
      return { error: json.message || "API error", raw: json };
    }

    if (!json.values || !Array.isArray(json.values)) {
      return { error: "No candles", raw: json };
    }

    const candles = json.values.map(c => ({
      time: c.datetime,
      open: parseFloat(c.open),
      high: parseFloat(c.high),
      low: parseFloat(c.low),
      close: parseFloat(c.close),
      volume: parseFloat(c.volume ?? 0)
    }));

    return { candles };
  } catch (err) {
    return { error: err.message };
  }
}

export default async function handler(req, res) {
  try {
    const result = {};

    for (const tf of Object.keys(TF_MAP)) {
      result[tf] = await fetchTF(tf);
    }

    return res.status(200).json({
      status: "ok",
      symbol: SYMBOL,
      provider: "twelvedata",
      data: result
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

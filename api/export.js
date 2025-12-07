// Maps resolutions to Yahoo Finance parameters
const TF_MAP = {
  M1: { interval: "1m", range: "1d" },
  M5: { interval: "5m", range: "5d" },
  M15: { interval: "15m", range: "1mo" },
  H1: { interval: "1h", range: "1mo" }
};

// Stable Yahoo Finance symbol for GOLD
const SYMBOL = "GC=F";

// Fetch data from Yahoo Finance for a given TF
async function fetchTF(tf) {
  const { interval, range } = TF_MAP[tf];

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
    SYMBOL
  )}?interval=${interval}&range=${range}`;

  const response = await fetch(url);
  const raw = await response.json();

  // If Yahoo returns no data (null result)
  if (!raw.chart || !raw.chart.result || raw.chart.result.length === 0) {
    return { error: "No data returned" };
  }

  const result = raw.chart.result[0];

  // Normalize candles into unified structure
  const timestamps = result.timestamp || [];
  const o = result.indicators.quote[0].open || [];
  const h = result.indicators.quote[0].high || [];
  const l = result.indicators.quote[0].low || [];
  const c = result.indicators.quote[0].close || [];
  const v = result.indicators.quote[0].volume || [];

  const candles = timestamps.map((t, i) => ({
    time: t,
    open: o[i],
    high: h[i],
    low: l[i],
    close: c[i],
    volume: v[i]
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
      symbol: SYMBOL,
      data: result
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

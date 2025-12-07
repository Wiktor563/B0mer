// Maps resolutions to Yahoo Finance parameters
const TF_MAP = {
  M1: { interval: "1m", range: "1d" },
  M5: { interval: "5m", range: "5d" },
  M15: { interval: "15m", range: "1mo" },
  H1: { interval: "1h", range: "1mo" }
};

// Fetch data from Yahoo Finance for a given TF
async function fetchTF(tf) {
  const { interval, range } = TF_MAP[tf];

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/XAUUSD=X?interval=${interval}&range=${range}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.chart.result[0];
}

export default async function handler(req, res) {
  try {
    const result = {};

    // Loop through all timeframes
    for (const tf of Object.keys(TF_MAP)) {
      result[tf] = await fetchTF(tf);
    }

    return res.status(200).json({
      status: "ok",
      source: "yahoo",
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

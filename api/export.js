import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const symbol = "XAUUSD"; // symbol bez slash!
    const intervals = ["1min", "5min", "15min", "30min", "1h"];
    const names = ["M1", "M5", "M15", "M30", "H1"];

    const apiKey = "dc89542d1cb0415d86c9d4ce03e07ad0"; // Twój klucz

    let result = {};

    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const name = names[i];

      const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&apikey=${apiKey}&outputsize=200`;

      const response = await fetch(url);
      const data = await response.json();

      result[name] = data;
    }

    res.status(200).json({
      status: "ok",
      symbol,
      provider: "twelvedata",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}

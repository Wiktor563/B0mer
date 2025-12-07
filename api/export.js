import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const symbol = "XAU/USD"; // instrument
    const intervals = ["1min", "5min", "15min", "30min", "1h"];
    const names = ["M1", "M5", "M15", "M30", "H1"];

    const apiKey = "dc89542d1cb0415d86c9d4ce03e07ad0"; // Twój klucz API

    let result = {
      status: "ok",
      provider: "twelvedata",
      symbol: symbol,
      data: {}
    };

    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      const name = names[i];

      const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(
        symbol
      )}&interval=${interval}&apikey=${apiKey}&outputsize=300`;

      const response = await fetch(url);
      const json = await response.json();

      // zapisujemy pod M1, M5, M15, M30, H1
      result.data[name] = json;
    }

    const file = JSON.stringify(result, null, 2);

    // nagłówki pobierania pliku
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=candles.json");

    res.status(200).send(file);

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

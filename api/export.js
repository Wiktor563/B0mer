import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const symbol = "XAU/USD";                   // instrument
    const apiKey = "dc89542d1cb0415d86c9d4ce03e07ad0"; // Twój klucz API

    const intervals = [
      { name: "M1",  interval: "1min"  },
      { name: "M5",  interval: "5min"  },
      { name: "M15", interval: "15min" },
      { name: "M30", interval: "30min" },
      { name: "H1",  interval: "1h"    },
    ];

    let result = {};

    for (const tf of intervals) {
      const url =
        `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}` +
        `&interval=${tf.interval}&apikey=${apiKey}&outputsize=500`;

      const response = await fetch(url);
      const json = await response.json();

      // jeśli jest error API
      if (!json || !json.values) {
        result[tf.name] = { error: json };
        continue;
      }

      // KONWERSJA DO FORMY KOMPAKTOWEJ
      // [timestamp, open, high, low, close]
      const compact = json.values.map(v => ([
        v.datetime,
        parseFloat(v.open),
        parseFloat(v.high),
        parseFloat(v.low),
        parseFloat(v.close)
      ]));

      result[tf.name] = compact;
    }

    // GOTOWA odpowiedź
    res.status(200).json({
      status: "ok",
      provider: "twelvedata",
      symbol,
      data: result,
    });

  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
}

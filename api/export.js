import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const symbol = "XAU/USD";
    const apiKey = "dc89542d1cb0415d86c9d4ce03e07ad0";

    // ile świec potrzebujemy na każdy TF
    const intervals = [
      { name: "M1",  interval: "1min",  limit: 80  },
      { name: "M5",  interval: "5min",  limit: 30  },
      { name: "M15", interval: "15min", limit: 20  },
      { name: "M30", interval: "30min", limit: 10  },
      { name: "H1",  interval: "1h",    limit: 5   },
    ];

    let result = {
      status: "ok",
      provider: "twelvedata",
      symbol,
      data: {}
    };

    for (const tf of intervals) {
      const url =
        `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}` +
        `&interval=${tf.interval}&apikey=${apiKey}&outputsize=${tf.limit}`;

      const response = await fetch(url);
      const json = await response.json();

      if (!json || !json.values) {
        result.data[tf.name] = { error: json };
        continue;
      }

      // kompakt: [time, open, high, low, close]
      const compact = json.values.map(v => ([
        v.datetime,
        Number(v.open),
        Number(v.high),
        Number(v.low),
        Number(v.close)
      ]));

      // dajemy dokładną liczbę świec
      result.data[tf.name] = compact.slice(0, tf.limit);
    }

    const file = JSON.stringify(result, null, 2);

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

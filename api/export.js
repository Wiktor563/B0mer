export default async function handler(req, res) {
  try {
    const symbol = "XAUUSD=X";  

    // tutaj ustawiamy dokładnie tyle świec, ile BOMER MACHINE v3.1 potrzebuje:
    const intervals = [
      { name: "M1",  interval: "1m",  limit: 150 },
      { name: "M5",  interval: "5m",  limit: 80  },
      { name: "M15", interval: "15m", limit: 50  },
      { name: "M30", interval: "30m", limit: 30  },
      { name: "H1",  interval: "60m", limit: 20  }
    ];

    async function fetchYahoo(tf) {
      const url =
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
        `?interval=${tf.interval}&range=7d`;

      const response = await fetch(url);
      const raw = await response.json();

      const result = raw.chart?.result?.[0];
      if (!result) return { error: "No data" };

      const timestamps = result.timestamp || [];
      const ohlc = result.indicators?.quote?.[0] || {};

      const candles = timestamps.map((t, i) => ([
        t * 1000,
        ohlc.open?.[i] ?? null,
        ohlc.high?.[i] ?? null,
        ohlc.low?.[i] ?? null,
        ohlc.close?.[i] ?? null
      ])).filter(c => c[1] !== null);

      return candles.slice(-tf.limit); // ostatnie świeczki
    }

    let data = {};

    for (const tf of intervals) {
      data[tf.name] = await fetchYahoo(tf);
    }

    const file = JSON.stringify(
      {
        status: "ok",
        provider: "yahoo",
        symbol,
        data
      },
      null,
      2
    );

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=candles.json");
    res.status(200).send(file);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

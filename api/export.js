export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(400).json({
        status: "error",
        message: "Use POST method and send MT5 candle data"
      });
    }

    const body = req.body;

    if (!body || !body.symbol || !body.timeframe || !body.bars) {
      return res.status(400).json({
        status: "error",
        message: "Missing fields: symbol, timeframe, bars[]"
      });
    }

    const payload = {
      received_at: new Date().toISOString(),
      symbol: body.symbol,
      timeframe: body.timeframe,
      bars: body.bars
    };

    // Zwracamy dane w JSON – MT5 będzie je wysyłało co 4h / 8h / 14h
    return res.status(200).json({
      status: "ok",
      data: payload
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message
    });
  }
}

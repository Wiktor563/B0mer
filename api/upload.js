export default function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Only POST requests are allowed." });
  }

  try {
    const data = req.body;

    if (!data) {
      return res.status(400).json({ ok: false, error: "Empty body" });
    }

    console.log("Received data:", data);

    return res.status(200).json({
      ok: true,
      message: "Data received successfully",
      received: data
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}

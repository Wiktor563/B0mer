export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        ok: false,
        error: "Only POST requests are allowed."
      });
    }

    const payload = req.body;

    console.log("🔥 BOMER DATA RECEIVED:", payload);

    return res.status(200).json({
      ok: true,
      status: "saved",
      timestamp: new Date().toISOString(),
      size_bytes: JSON.stringify(payload).length
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: err.message
    });
  }
}

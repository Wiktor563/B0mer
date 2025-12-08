import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Only POST allowed" });
  }

  try {
    const body = req.body;

    // Plik docelowy
    const filePath = path.join(process.cwd(), "bomer_candles.json");

    // Nadpisanie pliku
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

    return res.status(200).json({
      ok: true,
      message: "File saved successfully",
      size: JSON.stringify(body).length
    });

  } catch (e) {
    return res.status(500).json({ ok: false, error: e.toString() });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "2mb",
    },
  },
};

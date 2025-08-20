// Serverless Function: /api/prices  (proxy EU pentru Binance public ticker/price)
// Suporta: /api/prices           → lista completa
//          /api/prices?symbol=BTCUSDT  → un singur simbol

export default async function handler(req, res) {
  try {
    const { symbol } = req.query || {};
    const base = 'https://api.binance.com/api/v3/ticker/price';
    const url = symbol ? `${base}?symbol=${encodeURIComponent(symbol)}` : base;

    const r = await fetch(url);
    const text = await r.text();

    res.setHeader('cache-control', 's-maxage=15, stale-while-revalidate=30');
    res.setHeader('content-type', 'application/json');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}

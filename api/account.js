// Serverless Function (Node 18) – /api/v3/account proxy (balances)
// Cheile stau in ENV (Vercel), nu in foaie.
export default async function handler(req, res) {
  try {
    const { default: crypto } = await import('crypto');

    // Optional: token simplu de acces (adaugat in ENV PROXY_TOKEN)
    const needToken = process.env.PROXY_TOKEN;
    if (needToken && req.query.token !== needToken) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const apiKey = process.env.BINANCE_API_KEY;
    const secret = process.env.BINANCE_API_SECRET;
    if (!apiKey || !secret) {
      res.status(500).json({ error: 'Missing env BINANCE_API_KEY/SECRET' });
      return;
    }

    // Folosim timpul serverului Binance ca sa evitam eroarea -1021 (timestamp)
    const tResp = await fetch('https://api.binance.com/api/v3/time');
    const { serverTime } = await tResp.json();

    const recvWindow = 20000; // 20s, generos
    const qs = `timestamp=${serverTime}&recvWindow=${recvWindow}`;
    const sig = crypto.createHmac('sha256', secret).update(qs).digest('hex');

    const url = `https://api.binance.com/api/v3/account?${qs}&signature=${sig}`;
    const r = await fetch(url, { headers: { 'X-MBX-APIKEY': apiKey } });
    const text = await r.text();

    res.setHeader('content-type', 'application/json');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}

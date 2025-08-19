// Serverless: passthrough pentru Binance public /api/v3/ticker/price (fara semnare)
module.exports = async (req, res) => {
  try {
    const needToken = process.env.PROXY_TOKEN;
    if (needToken && req.query.token !== needToken) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    const r = await fetch('https://api.binance.com/api/v3/ticker/price');
    const text = await r.text();
    res.setHeader('content-type', 'application/json');
    res.status(r.status).send(text);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};

import { getCurrentState } from './_graph-state.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const state = await getCurrentState();
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({ ok: true, ...state });
}

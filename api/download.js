// ================= BACKEND =================
// File: api/download.js

import axios from 'axios';

function resolveUrl(base, relative) {
  if (relative.startsWith('http')) return relative;
  return new URL(relative, base).href;
}

export default async function handler(req, res) {
  try {
    const { url } = req.body;

    const playlistRes = await axios.get(url);
    const lines = playlistRes.data.split('\n');

    const segments = lines
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'))
      .map(l => resolveUrl(url, l));

    const buffers = [];

    for (let seg of segments) {
      const r = await axios.get(seg, { responseType: 'arraybuffer' });
      buffers.push(Buffer.from(r.data));
    }

    const finalBuffer = Buffer.concat(buffers);

    res.setHeader('Content-Type', 'video/mp2t');
    res.setHeader('Content-Disposition', 'attachment; filename="video.ts"');

    res.send(finalBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
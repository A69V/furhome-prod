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

    if (segments.length === 0) {
      return res.status(400).json({ error: "No segments found" });
    }

    res.setHeader('Content-Type', 'video/mp2t');
    res.setHeader('Content-Disposition', 'attachment; filename=\"video.ts\"');

    // 🔥 STREAM segments instead of buffering
    for (let seg of segments) {
      const response = await axios({
        url: seg,
        method: 'GET',
        responseType: 'stream',
      });

      await new Promise((resolve, reject) => {
        response.data.pipe(res, { end: false });
        response.data.on('end', resolve);
        response.data.on('error', reject);
      });
    }

    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
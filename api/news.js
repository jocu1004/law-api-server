import axios from 'axios';
import * as xml2js from 'xml2js';

export default async function handler(req, res) {
  const { source } = req.query;

  let rssUrl = '';
  if (source === 'lawtimes') {
    rssUrl = 'https://www.lawtimes.co.kr/rss/rss.xml';
  } else if (source === 'lawissue') {
    rssUrl = 'https://www.lawissue.co.kr/rss/allArticle.xml';
  } else {
    return res.status(400).json({ error: 'Invalid source parameter' });
  }

  try {
    const response = await axios.get(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MyLegalNewsBot/1.0; +https://example.com)'
      },
      timeout: 5000
    });

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const items = result.rss.channel.item.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate
    }));

    return res.status(200).json({ source, items });
  } catch (error) {
    console.error('RSS fetch failed:', error.message);
    return res.status(500).json({ error: 'RSS fetch failed', detail: error.message });
  }
}


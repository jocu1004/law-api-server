import axios from 'axios';

export default async function handler(req, res) {
  const { source } = req.query;

  let rssUrl;
  if (source === 'lawtimes') {
    rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.lawtimes.co.kr/rss/rss.xml';
  } else if (source === 'lawissue') {
    rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.lawissue.co.kr/rss/allArticle.xml';
  } else {
    return res.status(400).json({ error: 'Invalid source parameter' });
  }

  try {
    const response = await axios.get(rssUrl);
    const articles = response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      pubDate: item.pubDate,
      description: item.description
    }));

    return res.status(200).json({ source, articles });
  } catch (error) {
    console.error('RSS fetch failed:', error.message);
    return res.status(500).json({ error: 'RSS fetch failed', detail: error.message });
  }
}

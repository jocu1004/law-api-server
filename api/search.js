import axios from 'axios';
import { Parser } from 'xml2js';

export default async function handler(req, res) {
  const { keyword } = req.query;
  const OC = 'jocu1004';
  const url = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=law&query=${encodeURIComponent(keyword)}&type=XML`;

  try {
    const response = await axios.get(url);
    const parser = new Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Request failed:', error.message);
    return res.status(500).json({ error: 'Request failed', detail: error.message });
  }
}

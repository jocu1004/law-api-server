import axios from 'axios';
import { Parser } from 'xml2js';

import axios from 'axios';
import { Parser } from 'xml2js';

export default async function handler(req, res) {
  const { keyword } = req.query;
  const OC = 'jocu1004';

  const urlLaw = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=law&query=${encodeURIComponent(keyword)}&type=XML`;
  const urlPrec = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=prec&query=${encodeURIComponent(keyword)}&type=XML`;
  const urlHistory = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=lawHistory&query=${encodeURIComponent(keyword)}&type=XML`;

  try {
    const [responseLaw, responsePrec, responseHistory] = await Promise.all([
      axios.get(urlLaw),
      axios.get(urlPrec),
      axios.get(urlHistory)
    ]);

    const parser = new Parser({ explicitArray: false });

    const [lawResult, precResult, historyResult] = await Promise.all([
      parser.parseStringPromise(responseLaw.data),
      parser.parseStringPromise(responsePrec.data),
      parser.parseStringPromise(responseHistory.data)
    ]);

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({
      laws: lawResult,
      precedents: precResult,
      lawHistory: historyResult
    });

  } catch (error) {
    console.error('Request failed:', error.message);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Request failed', detail: error.message });
  }
}

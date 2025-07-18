const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
  const keyword = req.query.keyword || '';
  const API_KEY = 'jocu1004';
  const apiUrl = `https://www.law.go.kr/DRF/lawSearch.do?OC=${API_KEY}&target=law&query=${encodeURIComponent(keyword)}&type=XML`;

  try {
    const response = await axios.get(apiUrl);
    const xml = response.data;

    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        console.error('XML parsing error:', err);
        return res.status(500).json({ error: 'XML parsing error' });
      }

      const laws = [];
      const lawList = result.LawSearch && result.LawSearch.law
        ? Array.isArray(result.LawSearch.law)
          ? result.LawSearch.law
          : [result.LawSearch.law]
        : [];

      for (const law of lawList) {
        laws.push({
          법령명: law.lawName || '',
          법령ID: law.lawId || '',
          공포일자: law.promulgationDate || '',
          소관부처: law.administ || '',
          링크: `https://www.law.go.kr/법령/${encodeURIComponent(law.lawName || '')}`
        });
      }

      res.json({ keyword, laws });
    });
  } catch (error) {
    console.error('API request failed:', error.message);
    res.status(500).json({ error: '국가법령정보 API 요청 실패' });
  }
};

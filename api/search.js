const axios = require('axios');
const xml2js = require('xml2js');

module.exports = async (req, res) => {
  const keyword = req.query.keyword;
  const OC = 'jocu1004';  // 국가법령정보 API 등록된 OC
  const url = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=law&query=${encodeURIComponent(keyword)}&type=XML`;

  try {
    const response = await axios.get(url);
    const xml = response.data;

    const parser = new xml2js.Parser({ explicitArray: false });
    parser.parseString(xml, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'XML parsing error', detail: err.message });
      }
      return res.status(200).json(result);
    });
  } catch (error) {
    console.error('API error:', error.message);
    return res.status(500).json({ error: 'API request failed', detail: error.message });
  }
};

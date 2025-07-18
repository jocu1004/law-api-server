const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/search", async (req, res) => {
  const keyword = req.query.keyword || "";
  const url = `https://www.law.go.kr/DRF/lawSearch.do?OC=jocu1004&target=law&query=${encodeURIComponent(keyword)}&type=XML`;

  try {
    const response = await axios.get(url);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(response.data);
  } catch (error) {
    console.error("API 호출 에러:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;

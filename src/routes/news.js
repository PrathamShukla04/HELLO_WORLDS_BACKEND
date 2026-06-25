// routes/news.js
const express = require("express");
const router = express.Router();

router.get("/news", async (req, res) => {
  const { page = 1 } = req.query;
  const url = `https://gnews.io/api/v4/top-headlines?category=technology&page=${page}&max=10&lang=en&apikey=${process.env.GNEWS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

module.exports = router;
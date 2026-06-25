// routes/stats.js
router.get('/stats', async (req, res) => {
  try {
    const developerCount = await User.countDocuments();
    res.json({ developers: developerCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
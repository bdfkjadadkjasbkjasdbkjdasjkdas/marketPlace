
const express = require('express');
const { Client } = require('@replit/object-storage');

const app = express();
const storage = new Client();
const ITEMS_KEY = 'marketItems.json';

app.use(express.json());
app.use(express.static('./'));

app.get('/api/items', async (req, res) => {
  try {
    const data = await storage.get(ITEMS_KEY);
    if (!data) {
      await storage.set(ITEMS_KEY, '[]');
      return res.json([]);
    }
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to get items' });
  }
});

app.post('/api/items', async (req, res) => {
  if (!req.body) return res.status(400).json({ error: 'No data provided' });
  
  try {
    await storage.set(ITEMS_KEY, JSON.stringify(req.body));
    const savedData = await storage.get(ITEMS_KEY);
    res.json(JSON.parse(savedData));
  } catch (error) {
    console.error('Save items error:', error);
    res.status(500).json({ error: 'Failed to save items' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

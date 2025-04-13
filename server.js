
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
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.json([]);
  }
});

app.post('/api/items', async (req, res) => {
  if (!req.body) return res.sendStatus(400);
  
  try {
    await storage.set(ITEMS_KEY, JSON.stringify(req.body));
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

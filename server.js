
const express = require('express');
const { Client } = require('@replit/object-storage');

const app = express();
const storage = new Client();
const ITEMS_KEY = 'marketItems.json';

app.use(express.json());
app.use(express.static('./'));

app.get('/api/items', async (req, res) => {
  try {
    let data = await storage.get(ITEMS_KEY);
    if (!data) {
      data = '[]';
      await storage.set(ITEMS_KEY, data);
    }
    console.log('Retrieved items:', data);
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get items error:', error);
    res.json([]);
  }
});

app.post('/api/items', async (req, res) => {
  if (!req.body || !Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Invalid data provided' });
  }
  
  try {
    const itemsString = JSON.stringify(req.body);
    console.log('Saving items:', itemsString);
    await storage.set(ITEMS_KEY, itemsString);
    res.json(req.body);
  } catch (error) {
    console.error('Save items error:', error);
    res.status(500).json({ error: 'Failed to save items' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

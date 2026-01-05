const express = require('express');
const { getDb } = require('../database/db');
const { verifyToken } = require('./auth');
const FashionMatrixAgent = require('../services/fashionMatrixAgent');

const router = express.Router();

// Suggest outfits using Fashion Matrix Agent
router.get('/suggest', verifyToken, async (req, res) => {
  try {
    const { season } = req.query; // "Summer" or "Winter"
    const selectedSeason = season || 'Summer';

    const db = getDb();

    // Get user's clothes
    db.all(
      'SELECT * FROM clothes WHERE user_id = ? ORDER BY category',
      [req.userId],
      async (err, clothes) => {
        if (err) {
          db.close();
          return res.status(500).json({ error: 'Database error' });
        }

        if (clothes.length === 0) {
          db.close();
          return res.status(404).json({ error: 'No clothes found. Please add some items first.' });
        }

        // Generate outfits with Fashion Matrix Agent
        const agent = new FashionMatrixAgent();
        const result = agent.generateOutfits(clothes, selectedSeason);

        // Return both wardrobe analysis and recommendations
        res.json(result);
        db.close();
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save an outfit
router.post('/save', verifyToken, (req, res) => {
  try {
    const { item_ids } = req.body;

    if (!item_ids || !Array.isArray(item_ids) || item_ids.length === 0) {
      return res.status(400).json({ error: 'Item IDs are required' });
    }

    const db = getDb();
    const itemIdsJson = JSON.stringify(item_ids);

    db.run(
      'INSERT INTO saved_outfits (user_id, item_ids) VALUES (?, ?)',
      [req.userId, itemIdsJson],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({
          id: this.lastID,
          user_id: req.userId,
          item_ids: item_ids
        });
        db.close();
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get saved outfits
router.get('/saved', verifyToken, (req, res) => {
  try {
    const db = getDb();

    db.all(
      'SELECT * FROM saved_outfits WHERE user_id = ? ORDER BY created_at DESC',
      [req.userId],
      async (err, outfits) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // For each outfit, fetch the actual clothing items
        const outfitsWithItems = [];

        for (const outfit of outfits) {
          const itemIds = JSON.parse(outfit.item_ids);
          const placeholders = itemIds.map(() => '?').join(',');

          const items = await new Promise((resolve, reject) => {
            db.all(
              `SELECT * FROM clothes WHERE id IN (${placeholders})`,
              itemIds,
              (err, items) => {
                if (err) reject(err);
                else resolve(items);
              }
            );
          });

          outfitsWithItems.push({
            id: outfit.id,
            created_at: outfit.created_at,
            items: items
          });
        }

        res.json(outfitsWithItems);
        db.close();
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
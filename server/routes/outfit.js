const express = require('express');
const { getDb } = require('../database/db');
const { verifyToken } = require('./auth');

const router = express.Router();

// Suggest a random outfit
router.get('/suggest', verifyToken, (req, res) => {
  try {
    const db = getDb();
    
    // Get user's clothes by category
    db.all(
      'SELECT * FROM clothes WHERE user_id = ? ORDER BY category',
      [req.userId],
      (err, clothes) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (clothes.length === 0) {
          return res.status(404).json({ error: 'No clothes found. Please add some items first.' });
        }

        const tops = clothes.filter(c => c.category === 'Top');
        const bottoms = clothes.filter(c => c.category === 'Bottom');
        const fullBody = clothes.filter(c => c.category === 'Full-body');
        const shoes = clothes.filter(c => c.category === 'Shoes');
        const outerwear = clothes.filter(c => c.category === 'Outerwear');

        let outfit = [];
        let selectedSeason = null;

        // Logic: Either (Top + Bottom) OR Full-body
        const useFullBody = fullBody.length > 0 && Math.random() > 0.5;

        if (useFullBody) {
          const selected = fullBody[Math.floor(Math.random() * fullBody.length)];
          outfit.push(selected);
          selectedSeason = selected.season;
        } else {
          if (tops.length > 0 && bottoms.length > 0) {
            const selectedTop = tops[Math.floor(Math.random() * tops.length)];
            const selectedBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
            outfit.push(selectedTop, selectedBottom);
            // Use the season from top or bottom (prioritize specific season over "All")
            selectedSeason = selectedTop.season !== 'All' ? selectedTop.season : selectedBottom.season;
          } else if (tops.length > 0) {
            const selectedTop = tops[Math.floor(Math.random() * tops.length)];
            outfit.push(selectedTop);
            selectedSeason = selectedTop.season;
          } else if (bottoms.length > 0) {
            const selectedBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
            outfit.push(selectedBottom);
            selectedSeason = selectedBottom.season;
          } else if (fullBody.length > 0) {
            const selected = fullBody[Math.floor(Math.random() * fullBody.length)];
            outfit.push(selected);
            selectedSeason = selected.season;
          }
        }

        // Add matching shoes
        if (shoes.length > 0) {
          // Filter shoes by season - match or "All"
          let matchingShoes = shoes.filter(s => 
            s.season === selectedSeason || s.season === 'All' || selectedSeason === 'All'
          );
          
          // If no matching shoes, use any shoes
          if (matchingShoes.length === 0) {
            matchingShoes = shoes;
          }
          
          const selectedShoe = matchingShoes[Math.floor(Math.random() * matchingShoes.length)];
          outfit.push(selectedShoe);
        }

        // Optionally add outerwear (30% chance)
        if (outerwear.length > 0 && Math.random() > 0.7) {
          let matchingOuterwear = outerwear.filter(o => 
            o.season === selectedSeason || o.season === 'All' || selectedSeason === 'All'
          );
          
          if (matchingOuterwear.length === 0) {
            matchingOuterwear = outerwear;
          }
          
          const selectedOuterwear = matchingOuterwear[Math.floor(Math.random() * matchingOuterwear.length)];
          outfit.push(selectedOuterwear);
        }

        if (outfit.length === 0) {
          return res.status(404).json({ error: 'Not enough items to create an outfit' });
        }

        res.json({ outfit });
        db.close();
      }
    );
  } catch (error) {
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
      function(err) {
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
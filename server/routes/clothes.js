const express = require('express');
const multer = require('multer');
const path = require('path');
const { getDb } = require('../database/db');
const { verifyToken } = require('./auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Upload a new clothing item
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  try {
    console.log('Upload request received');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    console.log('User ID:', req.userId);
    
    const { item_name, category, season } = req.body;
    
    if (!req.file) {
      console.log('Error: No file uploaded');
      return res.status(400).json({ error: 'Image is required' });
    }
    
    if (!item_name || !category || !season) {
      console.log('Error: Missing fields', { item_name, category, season });
      return res.status(400).json({ error: 'All fields are required' });
    }

    const db = getDb();
    const imagePath = `/uploads/${req.file.filename}`;
    console.log('Saving to database:', { req_userId: req.userId, imagePath, item_name, category, season });

    db.run(
      'INSERT INTO clothes (user_id, image_path, item_name, category, season) VALUES (?, ?, ?, ?, ?)',
      [req.userId, imagePath, item_name, category, season],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        console.log('Item saved successfully:', this.lastID);
        res.json({
          id: this.lastID,
          user_id: req.userId,
          image_path: imagePath,
          item_name,
          category,
          season
        });
        db.close();
      }
    );
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all clothes for the logged-in user
router.get('/', verifyToken, (req, res) => {
  try {
    const { category, season } = req.query;
    const db = getDb();
    
    let query = 'SELECT * FROM clothes WHERE user_id = ?';
    const params = [req.userId];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (season) {
      query += ' AND season = ?';
      params.push(season);
    }
    
    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(rows);
      db.close();
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single clothing item
router.get('/:id', verifyToken, (req, res) => {
  try {
    const db = getDb();
    db.get(
      'SELECT * FROM clothes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
          return res.status(404).json({ error: 'Item not found' });
        }
        res.json(row);
        db.close();
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update last worn date
router.patch('/:id/wear', verifyToken, (req, res) => {
  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    
    db.run(
      'UPDATE clothes SET last_worn_date = ? WHERE id = ? AND user_id = ?',
      [today, req.params.id, req.userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ success: true, last_worn_date: today });
        db.close();
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a clothing item
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const db = getDb();
    db.run(
      'DELETE FROM clothes WHERE id = ? AND user_id = ?',
      [req.params.id, req.userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Item not found' });
        }
        res.json({ success: true });
        db.close();
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
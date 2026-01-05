const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'smartcloset.db');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function getDb() {
  return new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    }
  });
}

function initDatabase() {
  const db = getDb();

  // Create tables
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS clothes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id INTEGER NOT NULL, 
    image_path TEXT NOT NULL, 
    item_name TEXT NOT NULL, 
    category TEXT NOT NULL, 
    season TEXT NOT NULL, 
    last_worn_date TEXT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    color_hex TEXT DEFAULT NULL,
    color_family TEXT DEFAULT NULL,
    detected_type TEXT DEFAULT NULL,
    formality TEXT DEFAULT 'Casual',
    seasonality_score INTEGER DEFAULT 5,
    silhouette TEXT DEFAULT NULL,
    analyzed BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS saved_outfits (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_id INTEGER NOT NULL, 
    item_ids TEXT NOT NULL, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.close();
}

// Migration function for existing databases
function migrateDatabase() {
  const db = getDb();

  // Check if columns already exist before adding
  db.all("PRAGMA table_info(clothes)", [], (err, columns) => {
    if (err) {
      console.error('Error checking table structure:', err);
      db.close();
      return;
    }

    const existingColumns = columns.map(col => col.name);

    // Add new columns if they don't exist
    const newColumns = [
      { name: 'color_hex', type: 'TEXT DEFAULT NULL' },
      { name: 'color_family', type: 'TEXT DEFAULT NULL' },
      { name: 'detected_type', type: 'TEXT DEFAULT NULL' },
      { name: 'formality', type: "TEXT DEFAULT 'Casual'" },
      { name: 'seasonality_score', type: 'INTEGER DEFAULT 5' },
      { name: 'silhouette', type: 'TEXT DEFAULT NULL' },
      { name: 'analyzed', type: 'BOOLEAN DEFAULT 0' }
    ];

    newColumns.forEach(col => {
      if (!existingColumns.includes(col.name)) {
        db.run(`ALTER TABLE clothes ADD COLUMN ${col.name} ${col.type}`, (err) => {
          if (err) {
            console.error(`Error adding column ${col.name}:`, err.message);
          } else {
            console.log(`✓ Added column: ${col.name}`);
          }
        });
      }
    });

    db.close();
  });
}

module.exports = { getDb, initDatabase, migrateDatabase };
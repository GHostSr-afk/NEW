const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const clothesRoutes = require('./routes/clothes');
const outfitRoutes = require('./routes/outfit');
const { initDatabase, migrateDatabase } = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Updated for production deployment
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

initDatabase();
migrateDatabase();

app.use('/api/auth', authRoutes);
app.use('/api/clothes', clothesRoutes);
app.use('/api/outfit', outfitRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Catch-all route for React Router (must be last)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
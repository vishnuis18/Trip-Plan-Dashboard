const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const storage = require('./services/storage');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');
const savedPlaceRoutes = require('./routes/savedPlaceRoutes');
const exploreRoutes = require('./routes/exploreRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/saved-places', savedPlaceRoutes);
app.use('/api/explore', exploreRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: storage.isMongoConnected ? 'MongoDB' : 'Memory/JSON Store',
    app: 'TripPlan API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
const startServer = async () => {
  try {
    await storage.init();
    app.listen(PORT, () => {
      console.log(`🚀 TripPlan Backend running on http://localhost:${PORT}`);
      console.log(`📊 Mode: ${storage.isMongoConnected ? 'MongoDB (Connected)' : 'Intelligent Dual Store (Ready)'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

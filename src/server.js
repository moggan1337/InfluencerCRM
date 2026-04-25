const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const influencerRoutes = require('./routes/influencers');
const campaignRoutes = require('./routes/campaigns');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3002;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/influencercrm';

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/influencers', influencerRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'InfluencerCRM',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Dashboard stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    const Influencer = require('./models/Influencer');
    const Campaign = require('./models/Campaign');
    const Message = require('./models/Message');
    
    const [
      totalInfluencers,
      activeInfluencers,
      totalCampaigns,
      activeCampaigns,
      totalMessages,
      pendingMessages
    ] = await Promise.all([
      Influencer.countDocuments(),
      Influencer.countDocuments({ status: 'active' }),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: 'active' }),
      Message.countDocuments(),
      Message.countDocuments({ status: 'sent' })
    ]);
    
    // Get campaign performance
    const campaignStats = await Campaign.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: null,
          avgROI: { $avg: '$results.averageROI' },
          totalConversions: { $sum: '$results.totalConversions' },
          totalSpend: { $sum: '$budget.spent' }
        }
      }
    ]);
    
    res.json({
      influencers: {
        total: totalInfluencers,
        active: activeInfluencers
      },
      campaigns: {
        total: totalCampaigns,
        active: activeCampaigns
      },
      messages: {
        total: totalMessages,
        pending: pendingMessages
      },
      performance: campaignStats[0] || { avgROI: 0, totalConversions: 0, totalSpend: 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`InfluencerCRM server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // Start server anyway for demo purposes with in-memory fallback
    console.log('Starting in demo mode (no database)');
    app.listen(PORT, () => {
      console.log(`InfluencerCRM server running on port ${PORT} (demo mode)`);
    });
  });

module.exports = app;

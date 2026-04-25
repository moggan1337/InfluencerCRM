const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Influencer = require('../models/Influencer');

// GET /messages - List all messages
router.get('/', async (req, res) => {
  try {
    const { type, status, direction, influencerId, campaignId, limit = 50, page = 1 } = req.query;
    
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (direction) query.direction = direction;
    if (influencerId) query.influencer = influencerId;
    if (campaignId) query.campaign = campaignId;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [messages, total] = await Promise.all([
      Message.find(query)
        .populate('influencer', 'name email')
        .populate('campaign', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Message.countDocuments(query)
    ]);
    
    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /messages/:id - Get single message
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('influencer', 'name email socialProfiles')
      .populate('campaign', 'name');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /messages - Create/send message
router.post('/', async (req, res) => {
  try {
    const { influencerId, campaignId, type, subject, content, direction } = req.body;
    
    // Verify influencer exists
    const influencer = await Influencer.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    const message = new Message({
      influencer: influencerId,
      campaign: campaignId,
      type: type || 'email',
      direction: direction || 'outbound',
      subject,
      content,
      status: direction === 'outbound' ? 'sent' : 'delivered'
    });
    
    if (direction === 'outbound') {
      message.sentAt = new Date();
    }
    
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /messages/:id - Update message
router.put('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /messages/:id - Delete message
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /messages/:id/mark-opened - Mark message as opened
router.post('/:id/mark-opened', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    await message.markOpened();
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /messages/:id/mark-replied - Mark message as replied
router.post('/:id/mark-replied', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    await message.markReplied();
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /messages/influencer/:influencerId/conversation - Get full conversation
router.get('/influencer/:influencerId/conversation', async (req, res) => {
  try {
    const messages = await Message.findConversation(req.params.influencerId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /messages/stats - Get message statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [byStatus, byType, recentMessages] = await Promise.all([
      Message.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Message.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Message.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('influencer', 'name')
    ]);
    
    // Calculate response rate
    const totalOutbound = await Message.countDocuments({ direction: 'outbound' });
    const totalReplied = await Message.countDocuments({ direction: 'outbound', status: 'replied' });
    
    res.json({
      byStatus,
      byType,
      recentMessages,
      responseRate: totalOutbound > 0 ? (totalReplied / totalOutbound) * 100 : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

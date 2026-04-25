const express = require('express');
const router = express.Router();
const Influencer = require('../models/Influencer');

// GET /influencers - List all influencers
router.get('/', async (req, res) => {
  try {
    const { status, niche, minFollowers, maxFollowers, tags, search, limit = 50, page = 1 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (niche) query.niche = niche;
    if (tags) query.tags = { $in: tags.split(',') };
    
    if (minFollowers || maxFollowers) {
      query['socialProfiles.instagram.followers'] = {};
      if (minFollowers) query['socialProfiles.instagram.followers'].$gte = parseInt(minFollowers);
      if (maxFollowers) query['socialProfiles.instagram.followers'].$lte = parseInt(maxFollowers);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [influencers, total] = await Promise.all([
      Influencer.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Influencer.countDocuments(query)
    ]);
    
    res.json({
      influencers,
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

// GET /influencers/:id - Get single influencer
router.get('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id)
      .populate('campaigns', 'name status');
    
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    res.json(influencer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /influencers - Create influencer
router.post('/', async (req, res) => {
  try {
    const influencer = new Influencer(req.body);
    await influencer.save();
    res.status(201).json(influencer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// PUT /influencers/:id - Update influencer
router.put('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    res.json(influencer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /influencers/:id - Delete influencer
router.delete('/:id', async (req, res) => {
  try {
    const influencer = await Influencer.findByIdAndDelete(req.params.id);
    
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    res.json({ message: 'Influencer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /influencers/:id/notes - Add note to influencer
router.post('/:id/notes', async (req, res) => {
  try {
    const influencer = await Influencer.findById(req.params.id);
    
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    influencer.notes.push({
      text: req.body.text,
      author: req.body.author || 'System'
    });
    
    await influencer.save();
    res.json(influencer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /influencers/:id/messages - Get conversation with influencer
router.get('/:id/messages', async (req, res) => {
  try {
    const Message = require('../models/Message');
    const messages = await Message.findConversation(req.params.id);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /influencers/stats - Get influencer statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [byStatus, byNiche, topByFollowers] = await Promise.all([
      Influencer.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Influencer.aggregate([
        { $group: { _id: '$niche', count: { $sum: 1 } } }
      ]),
      Influencer.find()
        .sort({ 'socialProfiles.instagram.followers': -1 })
        .limit(10)
        .select('name socialProfiles.instagram.followers niche')
    ]);
    
    res.json({
      byStatus,
      byNiche,
      topByFollowers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

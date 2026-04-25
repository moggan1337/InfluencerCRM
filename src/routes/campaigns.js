const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Influencer = require('../models/Influencer');

// GET /campaigns - List all campaigns
router.get('/', async (req, res) => {
  try {
    const { status, brand, startDate, endDate, tags, limit = 50, page = 1 } = req.query;
    
    const query = {};
    
    if (status) query.status = status;
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (tags) query.tags = { $in: tags.split(',') };
    
    if (startDate || endDate) {
      query['timeline.startDate'] = {};
      if (startDate) query['timeline.startDate'].$gte = new Date(startDate);
      if (endDate) query['timeline.startDate'].$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [campaigns, total] = await Promise.all([
      Campaign.find(query)
        .populate('influencers.influencer', 'name email socialProfiles')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Campaign.countDocuments(query)
    ]);
    
    res.json({
      campaigns,
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

// GET /campaigns/:id - Get single campaign
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('influencers.influencer', 'name email socialProfiles niche');
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /campaigns - Create campaign
router.post('/', async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /campaigns/:id - Update campaign
router.put('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /campaigns/:id - Delete campaign
router.delete('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    res.json({ message: 'Campaign deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /campaigns/:id/influencers - Add influencer to campaign
router.post('/:id/influencers', async (req, res) => {
  try {
    const { influencerId, fee, deliverables } = req.body;
    
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const influencer = await Influencer.findById(influencerId);
    if (!influencer) {
      return res.status(404).json({ error: 'Influencer not found' });
    }
    
    // Check if already added
    const existingIndex = campaign.influencers.findIndex(
      i => i.influencer.toString() === influencerId
    );
    
    if (existingIndex >= 0) {
      return res.status(400).json({ error: 'Influencer already added to campaign' });
    }
    
    campaign.influencers.push({
      influencer: influencerId,
      status: 'invited',
      fee: fee || influencer.pricing.sponsoredPost,
      deliverables: deliverables || {
        posts: 1,
        stories: 0,
        videos: 0
      }
    });
    
    // Update campaign budget
    campaign.budget.spent += (fee || influencer.pricing.sponsoredPost);
    
    // Link campaign to influencer
    influencer.campaigns.push(campaign._id);
    await influencer.save();
    
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /campaigns/:id/influencers/:infId - Update influencer in campaign
router.put('/:id/influencers/:infId', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const influencerIndex = campaign.influencers.findIndex(
      i => i._id.toString() === req.params.infId
    );
    
    if (influencerIndex < 0) {
      return res.status(404).json({ error: 'Influencer not found in campaign' });
    }
    
    const { status, fee, deliverables, content, notes } = req.body;
    
    if (status) campaign.influencers[influencerIndex].status = status;
    if (fee !== undefined) campaign.influencers[influencerIndex].fee = fee;
    if (deliverables) campaign.influencers[influencerIndex].deliverables = deliverables;
    if (content) campaign.influencers[influencerIndex].content = content;
    if (notes) campaign.influencers[influencerIndex].notes = notes;
    
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /campaigns/:id/influencers/:infId - Remove influencer from campaign
router.delete('/:id/influencers/:infId', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    campaign.influencers = campaign.influencers.filter(
      i => i._id.toString() !== req.params.infId
    );
    
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /campaigns/:id/content - Add content to campaign influencer
router.post('/:id/influencers/:infId/content', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const influencerIndex = campaign.influencers.findIndex(
      i => i._id.toString() === req.params.infId
    );
    
    if (influencerIndex < 0) {
      return res.status(404).json({ error: 'Influencer not found in campaign' });
    }
    
    campaign.influencers[influencerIndex].content.push(req.body);
    campaign.influencers[influencerIndex].status = 'content-created';
    
    // Update campaign results if performance data provided
    if (req.body.performance) {
      const perf = req.body.performance;
      campaign.results.totalImpressions += perf.views || 0;
      campaign.results.totalEngagement += (perf.likes || 0) + (perf.comments || 0);
      campaign.results.totalReach += perf.reach || 0;
    }
    
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /campaigns/stats - Get campaign statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const [byStatus, byBrand, recentCampaigns] = await Promise.all([
      Campaign.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Campaign.aggregate([
        { $group: { _id: '$brand', totalBudget: { $sum: '$budget.total' }, count: { $sum: 1 } } },
        { $sort: { totalBudget: -1 } },
        { $limit: 10 }
      ]),
      Campaign.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name brand status budget.startDate')
    ]);
    
    // Calculate totals
    const totals = await Campaign.aggregate([
      {
        $group: {
          _id: null,
          totalBudget: { $sum: '$budget.total' },
          totalSpent: { $sum: '$budget.spent' },
          totalImpressions: { $sum: '$results.totalImpressions' },
          totalEngagement: { $sum: '$results.totalEngagement' },
          totalConversions: { $sum: '$results.totalConversions' }
        }
      }
    ]);
    
    res.json({
      byStatus,
      byBrand,
      recentCampaigns,
      totals: totals[0] || {}
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

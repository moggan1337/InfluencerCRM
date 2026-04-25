const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  objectives: [{
    type: String,
    enum: ['awareness', 'engagement', 'conversions', 'traffic', 'leads']
  }],
  platforms: [{
    type: String,
    enum: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'all']
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft'
  },
  budget: {
    total: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    isOngoing: { type: Boolean, default: false }
  },
  targeting: {
    niches: [String],
    minFollowers: { type: Number, default: 0 },
    maxFollowers: { type: Number },
    minEngagementRate: { type: Number, default: 0 },
    demographics: {
      ageRange: { min: Number, max: Number },
      locations: [String]
    }
  },
  deliverables: {
    posts: { type: Number, default: 0 },
    stories: { type: Number, default: 0 },
    videos: { type: Number, default: 0 },
    reels: { type: Number, default: 0 }
  },
  influencers: [{
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: 'Influencer' },
    status: { type: String, enum: ['invited', 'negotiating', 'confirmed', 'content-created', 'published', 'completed', 'declined'] },
    fee: Number,
    deliverables: {
      posts: { type: Number, default: 0 },
      stories: { type: Number, default: 0 },
      videos: { type: Number, default: 0 }
    },
    content: [{
      type: { type: String },
      caption: String,
      link: String,
      publishedAt: Date,
      performance: {
        likes: Number,
        comments: Number,
        shares: Number,
        views: Number,
        reach: Number
      }
    }],
    notes: String
  }],
  tracking: {
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    customTrackingParams: mongoose.Schema.Types.Mixed
  },
  results: {
    totalImpressions: { type: Number, default: 0 },
    totalEngagement: { type: Number, default: 0 },
    totalReach: { type: Number, default: 0 },
    totalConversions: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    averageROI: { type: Number, default: 0 }
  },
  tags: [String],
  notes: [{
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
campaignSchema.index({ status: 1 });
campaignSchema.index({ brand: 1 });
campaignSchema.index({ 'timeline.startDate': 1 });
campaignSchema.index({ 'influencers.influencer': 1 });

// Method to calculate ROI
campaignSchema.methods.calculateROI = function() {
  const results = this.results;
  if (results.totalSpend === 0) return 0;
  return ((results.totalConversions * 100) - results.totalSpend) / results.totalSpend * 100;
};

// Method to get campaign progress
campaignSchema.methods.getProgress = function() {
  const total = this.deliverables.posts + this.deliverables.stories + this.deliverables.videos;
  const completed = this.influencers.reduce((sum, inf) => {
    return sum + (inf.content?.length || 0);
  }, 0);
  
  return {
    total,
    completed,
    percentage: total > 0 ? (completed / total) * 100 : 0
  };
};

// Static to find active campaigns
campaignSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

module.exports = mongoose.model('Campaign', campaignSchema);

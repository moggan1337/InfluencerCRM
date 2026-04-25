const mongoose = require('mongoose');

const influencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  socialProfiles: {
    instagram: { handle: String, followers: Number, url: String },
    tiktok: { handle: String, followers: Number, url: String },
    youtube: { handle: String, subscribers: Number, url: String },
    twitter: { handle: String, followers: Number, url: String },
    facebook: { handle: String, followers: Number, url: String }
  },
  niche: {
    type: String,
    enum: ['fashion', 'beauty', 'fitness', 'tech', 'lifestyle', 'food', 'travel', 'gaming', 'entertainment', 'other'],
    default: 'other'
  },
  demographics: {
    ageRange: { min: Number, max: Number },
    gender: { type: String, enum: ['male', 'female', 'other', 'mixed'] },
    locations: [String]
  },
  engagement: {
    rate: { type: Number, default: 0 }, // Average engagement rate
    avgLikes: { type: Number, default: 0 },
    avgComments: { type: Number, default: 0 },
    avgViews: { type: Number, default: 0 }
  },
  pricing: {
    sponsoredPost: { type: Number, default: 0 },
    story: { type: Number, default: 0 },
    video: { type: Number, default: 0 },
    affiliateCommission: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['prospect', 'active', 'inactive', 'blocked'],
    default: 'prospect'
  },
  tags: [String],
  notes: [{
    text: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
  }],
  campaigns: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  }],
  performanceHistory: [{
    campaignId: mongoose.Schema.Types.ObjectId,
    roi: Number,
    conversions: Number,
    impressions: Number,
    engagement: Number,
    completedAt: Date
  }],
  source: {
    type: String,
    enum: [' outreach', 'referral', 'platform', 'cold-contact', 'other'],
    default: 'other'
  },
  reach: {
    total: { type: Number, default: 0 },
    average: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
influencerSchema.index({ email: 1 });
influencerSchema.index({ 'socialProfiles.instagram.followers': -1 });
influencerSchema.index({ niche: 1 });
influencerSchema.index({ status: 1 });
influencerSchema.index({ tags: 1 });

// Virtual for total followers
influencerSchema.virtual('totalFollowers').get(function() {
  let total = 0;
  const profiles = this.socialProfiles;
  
  if (profiles.instagram?.followers) total += profiles.instagram.followers;
  if (profiles.tiktok?.followers) total += profiles.tiktok.followers;
  if (profiles.youtube?.subscribers) total += profiles.youtube.subscribers;
  if (profiles.twitter?.followers) total += profiles.twitter.followers;
  
  return total;
});

// Method to calculate average engagement rate
influencerSchema.methods.calculateEngagementRate = function() {
  const engagement = this.engagement;
  const totalFollowers = this.totalFollowers;
  
  if (totalFollowers === 0) return 0;
  
  const totalEngagement = engagement.avgLikes + engagement.avgComments;
  return (totalEngagement / totalFollowers) * 100;
};

module.exports = mongoose.model('Influencer', influencerSchema);

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['email', 'dm', 'comment', 'note'],
    default: 'email'
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  subject: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'delivered', 'opened', 'replied', 'failed'],
    default: 'draft'
  },
  metadata: {
    platform: String,
    sender: String,
    recipient: String,
    messageId: String,
    threadId: String
  },
  sentAt: Date,
  deliveredAt: Date,
  openedAt: Date,
  repliedAt: Date
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ influencer: 1 });
messageSchema.index({ campaign: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ createdAt: -1 });

// Static to find conversation with influencer
messageSchema.statics.findConversation = function(influencerId) {
  return this.find({ influencer: influencerId })
    .sort({ createdAt: 1 })
    .populate('campaign', 'name');
};

// Method to mark as read/opened
messageSchema.methods.markOpened = function() {
  if (!this.openedAt) {
    this.openedAt = new Date();
    this.status = 'opened';
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to mark as replied
messageSchema.methods.markReplied = function() {
  if (!this.repliedAt) {
    this.repliedAt = new Date();
    this.status = 'replied';
    return this.save();
  }
  return Promise.resolve(this);
};

module.exports = mongoose.model('Message', messageSchema);

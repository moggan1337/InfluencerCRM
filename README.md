# InfluencerCRM 📊

<p align="center">
  <img src="https://img.shields.io/badge/CRM-Influencer-FF6B6B?style=for-the-badge&logo=people&logoColor=white" alt="CRM">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=for-the-badge" alt="PRs Welcome">
</p>

> 💼 **Influencer Marketing CRM** — Full-featured CRM system for managing influencer marketing campaigns. Track influencers, orchestrate campaigns, and measure ROI across all partnerships.

## About

InfluencerCRM is a comprehensive customer relationship management system designed specifically for influencer marketing. It provides end-to-end campaign management, from influencer discovery and outreach to performance tracking and payment management, all within a unified platform.

**Who it's for:**
- Marketing agencies managing multiple influencer campaigns
- Brands building in-house influencer programs
- Influencer managers handling multiple creators
- E-commerce brands tracking affiliate performance
- Media companies coordinating creator networks

## Features

### Influencer Management

| Feature | Description |
|---------|-------------|
| 👤 **Profile Management** | Comprehensive influencer profiles with contact info |
| 📱 **Social Profiles** | Track Instagram, TikTok, YouTube, Twitter, Facebook |
| 📊 **Engagement Metrics** | Followers, engagement rate, likes, comments, views |
| 💰 **Pricing Tiers** | Post, story, video, and affiliate pricing |
| 🏷️ **Niche & Demographics** | Audience demographics, interests, location |
| 📈 **Performance History** | Past campaign results per influencer |

### Campaign Management

| Feature | Description |
|---------|-------------|
| 📋 **Campaign Creation** | Full campaign lifecycle management |
| 👥 **Multi-Influencer** | Add multiple influencers to single campaign |
| 💵 **Budget Tracking** | Total budget vs. spent tracking |
| 📅 **Timeline Management** | Campaign start/end dates and milestones |
| 📦 **Deliverables** | Track posts, stories, videos, reels |
| ✅ **Status Pipeline** | Prospect → Active → Completed → Inactive |

### Communication

| Feature | Description |
|---------|-------------|
| 💬 **Message Threading** | Track all communications per influencer |
| 📧 **Email Integration** | Log emails and track responses |
| 📱 **DM Tracking** | Track direct messages |
| 📝 **Notes System** | Internal notes and call logs |
| 📊 **Response Tracking** | Mark messages as opened/replied |

### Performance Analytics

| Feature | Description |
|---------|-------------|
| 📈 **ROI Tracking** | Campaign return on investment |
| 📉 **Engagement Metrics** | Aggregate engagement across campaigns |
| 🔄 **Conversion Tracking** | Track clicks, purchases, sign-ups |
| 📊 **A/B Comparison** | Compare influencer performance |
| 📋 **Report Generation** | Exportable performance reports |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      InfluencerCRM Architecture                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     API Layer (Express.js)                 │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │  RESTful API Endpoints                              │  │   │
│  │  │                                                     │  │   │
│  │  │  /api/influencers  - Influencer management         │  │   │
│  │  │  /api/campaigns    - Campaign management           │  │   │
│  │  │  /api/messages      - Communication tracking        │  │   │
│  │  │  /api/stats         - Analytics & reporting        │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌────────────────────────────┴──────────────────────────────┐   │
│  │                    Business Logic Layer                    │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │   │
│  │  │  Influencer   │ │  Campaign    │ │   Message    │       │   │
│  │  │   Service     │ │   Service    │ │   Service   │       │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │   │
│  │  │   Analytics  │ │  Pipeline    │ │   Search    │       │   │
│  │  │   Service    │ │   Service    │ │   Service   │       │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│  ┌────────────────────────────┴──────────────────────────────┐   │
│  │                    Data Layer (MongoDB)                     │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │   │
│  │  │  Influencer  │ │  Campaign   │ │   Message    │       │   │
│  │  │   Model      │ │   Model     │ │   Model     │       │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Node.js 20+ |
| **Framework** | Express.js 4.18 |
| **Database** | MongoDB 6.0, Mongoose ODM |
| **Validation** | express-validator |
| **Architecture** | REST API, MVC pattern |

## Installation

### Prerequisites

- Node.js 20+
- MongoDB 6.0+
- npm or pnpm

### Steps

```bash
# Clone the repository
git clone https://github.com/moggan1337/InfluencerCRM.git
cd InfluencerCRM

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Configure environment variables
# Edit .env with your MongoDB connection string

# Start the server
npm start

# Or start with auto-reload for development
npm run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3002) | No |
| `MONGODB_URI` | MongoDB connection string | ✅ |
| `NODE_ENV` | Environment (development/production) | No |

## Quick Start

### 1. Create an Influencer

```bash
curl -X POST http://localhost:3002/api/influencers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "niche": "fashion",
    "socialProfiles": {
      "instagram": { "handle": "jane", "followers": 50000 },
      "tiktok": { "handle": "janedoe", "followers": 25000 }
    },
    "pricing": {
      "post": 500,
      "story": 200,
      "video": 1000
    }
  }'
```

### 2. Create a Campaign

```bash
curl -X POST http://localhost:3002/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Collection Launch",
    "brand": "Fashion Brand",
    "objectives": ["awareness", "engagement"],
    "budget": { "total": 10000, "spent": 0 },
    "startDate": "2024-06-01",
    "endDate": "2024-08-31"
  }'
```

### 3. Add Influencer to Campaign

```bash
curl -X POST http://localhost:3002/api/campaigns/:campaignId/influencers \
  -H "Content-Type: application/json" \
  -d '{
    "influencerId": "influencer_id",
    "agreedRate": 500,
    "deliverables": ["post", "story"]
  }'
```

### 4. Send a Message

```bash
curl -X POST http://localhost:3002/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "influencerId": "influencer_id",
    "type": "email",
    "direction": "outbound",
    "subject": "Campaign Collaboration",
    "content": "Hi Jane, we would love to collaborate..."
  }'
```

## Data Models

### Influencer Schema

```javascript
{
  // Contact Information
  name: String,
  email: String,
  phone: String,
  
  // Social Media Profiles
  socialProfiles: {
    instagram: { handle: String, followers: Number, engagementRate: Number },
    tiktok: { handle: String, followers: Number, engagementRate: Number },
    youtube: { handle: String, subscribers: Number, engagementRate: Number },
    twitter: { handle: String, followers: Number, engagementRate: Number },
    facebook: { handle: String, followers: Number, engagementRate: Number }
  },
  
  // Professional Details
  niche: String,
  demographics: {
    ageRange: String,
    locations: [String],
    interests: [String]
  },
  
  // Pricing (in cents)
  pricing: {
    post: Number,
    story: Number,
    video: Number,
    affiliate: Number
  },
  
  // Status Pipeline
  status: {
    type: String,
    enum: ['prospect', 'contacted', 'negotiating', 'active', 'inactive', 'blocked']
  },
  
  // Performance History
  campaigns: [{
    campaign: ObjectId,
    performance: {
      impressions: Number,
      engagement: Number,
      conversions: Number
    }
  }]
}
```

### Campaign Schema

```javascript
{
  name: String,
  brand: String,
  description: String,
  
  // Objectives
  objectives: [{
    type: String,
    enum: ['awareness', 'engagement', 'conversions', 'traffic']
  }],
  
  // Budget (in cents)
  budget: {
    total: Number,
    spent: Number
  },
  
  // Timeline
  startDate: Date,
  endDate: Date,
  
  // Target Demographics
  targetDemographics: {
    ageRange: String,
    locations: [String],
    interests: [String]
  },
  
  // Influencers in Campaign
  influencers: [{
    influencer: ObjectId,
    agreedRate: Number,
    deliverables: [{
      type: String,
      status: String,
      content: String,
      postedAt: Date
    }],
    status: String
  }],
  
  // Aggregated Results
  results: {
    totalImpressions: Number,
    totalEngagement: Number,
    totalConversions: Number
  }
}
```

### Message Schema

```javascript
{
  influencer: ObjectId,
  campaign: ObjectId,
  
  // Message Details
  type: {
    type: String,
    enum: ['email', 'dm', 'comment', 'note', 'call']
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound']
  },
  
  // Content
  subject: String,
  content: String,
  
  // Threading
  threadId: ObjectId,
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'sent', 'delivered', 'opened', 'replied']
  },
  
  // Timestamps
  sentAt: Date,
  openedAt: Date,
  repliedAt: Date
}
```

## API Reference

### Influencers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/influencers` | List influencers (with filtering) |
| `GET` | `/api/influencers/:id` | Get influencer details |
| `POST` | `/api/influencers` | Create influencer |
| `PUT` | `/api/influencers/:id` | Update influencer |
| `DELETE` | `/api/influencers/:id` | Delete influencer |
| `POST` | `/api/influencers/:id/notes` | Add note to influencer |
| `GET` | `/api/influencers/stats/overview` | Get influencer statistics |

### Campaigns

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/campaigns` | List campaigns |
| `GET` | `/api/campaigns/:id` | Get campaign details |
| `POST` | `/api/campaigns` | Create campaign |
| `PUT` | `/api/campaigns/:id` | Update campaign |
| `DELETE` | `/api/campaigns/:id` | Delete campaign |
| `POST` | `/api/campaigns/:id/influencers` | Add influencer to campaign |
| `PUT` | `/api/campaigns/:id/influencers/:infId` | Update influencer status |
| `POST` | `/api/campaigns/:id/influencers/:infId/content` | Add content deliverable |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/messages` | List messages |
| `POST` | `/api/messages` | Send/create message |
| `PUT` | `/api/messages/:id` | Update message |
| `POST` | `/api/messages/:id/mark-opened` | Mark as opened |
| `POST` | `/api/messages/:id/mark-replied` | Mark as replied |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Overview statistics |
| `GET` | `/api/stats/campaigns/:id` | Campaign-specific stats |
| `GET` | `/api/stats/influencers/:id` | Influencer-specific stats |

## Project Structure

```
InfluencerCRM/
├── src/
│   ├── server.js           # Express server setup
│   ├── models/
│   │   ├── Influencer.js   # Influencer Mongoose model
│   │   ├── Campaign.js     # Campaign Mongoose model
│   │   └── Message.js      # Message Mongoose model
│   └── routes/
│       ├── influencers.js  # Influencer API routes
│       ├── campaigns.js    # Campaign API routes
│       └── messages.js     # Message API routes
├── package.json
├── .env.example
└── README.md
```

## Extending

### Add Authentication

```javascript
// Add JWT middleware in server.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};
```

### Add Payment Tracking

```javascript
// Extend Campaign model with payment fields
paymentHistory: [{
  influencer: ObjectId,
  amount: Number,
  status: String,
  paidAt: Date,
  invoiceId: String
}]
```

### Add Media Asset Management

```javascript
// Add to Message model
attachments: [{
  type: String,
  url: String,
  thumbnail: String
}]
```

## Contributing

Contributions are welcome! Please follow these steps:

```bash
# Fork the repository
git clone https://github.com/<your-username>/InfluencerCRM.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add: amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## License

MIT License — See [LICENSE](LICENSE)

Copyright © 2024 InfluencerCRM Contributors

---

<p align="center">
  <sub>Empowering influencer marketing success</sub>
</p>

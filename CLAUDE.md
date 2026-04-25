# InfluencerCRM

Full-featured CRM for influencer marketing campaigns.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Architecture**: REST API with MVC pattern

## Key Files

- `src/server.js` - Express server setup and routes
- `src/models/Influencer.js` - Influencer schema and methods
- `src/models/Campaign.js` - Campaign schema and methods
- `src/models/Message.js` - Message schema for communications
- `src/routes/*.js` - API route handlers

## Influencer Schema

- Social profiles (Instagram, TikTok, YouTube, Twitter, Facebook)
- Engagement metrics (rate, likes, comments, views)
- Pricing tiers (posts, stories, videos, affiliate)
- Status pipeline: prospect → active → inactive → blocked
- Performance history per campaign

## Campaign Schema

- Multi-influencer support
- Budget tracking (total vs spent)
- Deliverables tracking (posts, stories, videos, reels)
- Platform targeting
- Results aggregation (impressions, engagement, conversions)

## Message Schema

- Supports email, DM, comment, note types
- Conversation threads
- Status tracking: draft → sent → delivered → opened → replied

## Extending

- Add authentication via JWT middleware
- Add campaign templates
- Add automated outreach sequences
- Add payment tracking integration
- Add media asset management

## Environment

- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string

# InfluencerCRM 📊

A comprehensive CRM system for managing influencer marketing campaigns.

## Features

- **Influencer Management**: Track influencers, their social profiles, engagement metrics, and pricing
- **Campaign Management**: Create and manage multi-influencer campaigns
- **Messaging**: Track all communications with influencers
- **Performance Analytics**: ROI tracking, engagement metrics, conversion tracking
- **Pipeline Management**: Track influencer status from prospect to active partner

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/influencercrm
```

## Usage

### Start the server
```bash
npm start
```

### Start with auto-reload
```bash
npm run dev
```

## API Endpoints

### Influencers
- `GET /api/influencers` - List influencers (with filtering)
- `GET /api/influencers/:id` - Get influencer details
- `POST /api/influencers` - Create influencer
- `PUT /api/influencers/:id` - Update influencer
- `DELETE /api/influencers/:id` - Delete influencer
- `POST /api/influencers/:id/notes` - Add note
- `GET /api/influencers/stats/overview` - Get statistics

### Campaigns
- `GET /api/campaigns` - List campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign
- `PUT /api/campaigns/:id` - Update campaign
- `POST /api/campaigns/:id/influencers` - Add influencer to campaign
- `PUT /api/campaigns/:id/influencers/:infId` - Update influencer status
- `POST /api/campaigns/:id/influencers/:infId/content` - Add content

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message
- `POST /api/messages/:id/mark-opened` - Mark as opened
- `POST /api/messages/:id/mark-replied` - Mark as replied

### Dashboard
- `GET /api/stats` - Overview statistics

## Data Models

### Influencer
- Contact info (name, email, phone)
- Social profiles with followers
- Niche and demographics
- Engagement metrics
- Pricing tiers
- Campaign history

### Campaign
- Brand and objectives
- Budget and timeline
- Target demographics
- Deliverables tracking
- Influencer roster
- Performance results

### Message
- Type (email, DM, comment, note)
- Direction (inbound/outbound)
- Status tracking
- Thread support

## Example Usage

```bash
# Create influencer
curl -X POST http://localhost:3002/api/influencers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "niche": "fashion",
    "socialProfiles": {
      "instagram": { "handle": "jane", "followers": 50000 }
    }
  }'

# Create campaign
curl -X POST http://localhost:3002/api/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Collection Launch",
    "brand": "Fashion Brand",
    "objectives": ["awareness", "engagement"],
    "budget": { "total": 10000 }
  }'
```

## Architecture

```
src/
├── server.js           # Express server
├── models/
│   ├── Influencer.js   # Influencer model
│   ├── Campaign.js     # Campaign model
│   └── Message.js      # Message model
└── routes/
    ├── influencers.js  # Influencer routes
    ├── campaigns.js    # Campaign routes
    └── messages.js    # Message routes
```

## License

MIT

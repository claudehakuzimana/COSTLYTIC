# Project Setup & Configuration Guide

## Overview
This is a comprehensive Costlytic Platform with complete server and client implementations.

## Server Setup

### Directory Structure
```
server/
├── config/               # Configuration files
│   ├── cors.js          # CORS configuration
│   ├── index.js         # Main config export
│   └── models.js        # Model imports
├── scripts/             # Utility scripts
│   ├── deploy.sh        # Deployment script
│   ├── migrate.sh       # Database migration
│   ├── backup.sh        # Database backup
│   ├── restore.sh       # Database restore
│   └── cli.js           # CLI interface
├── seed/                # Database seeding
│   └── seed.js          # Seed data script
├── utils/               # Utility functions
│   ├── pricing.js       # Pricing calculations
│   ├── jwt.js           # JWT utilities
│   ├── roles.js         # Role management
│   ├── health.js        # Health checks
│   ├── validation.js    # Input validation
│   ├── response.js      # Response formatting
│   ├── date.js          # Date utilities
│   ├── string.js        # String utilities
│   ├── number.js        # Number utilities
│   ├── logger.js        # Logging
│   ├── errorHandler.js  # Error handling
│   ├── index.js         # Utility exports
│   └── ...
├── src/
│   ├── config/          # Core configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── jobs/            # Background jobs
│   └── index.js         # App entry point
├── .env.example         # Environment template
├── package.json
├── Dockerfile
└── docker-compose.yml
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server with nodemon

# Production
npm start                # Start production server

# Database
npm run seed             # Seed database with sample data
npm run migrate          # Run database migrations
npm run backup           # Backup MongoDB
npm run restore          # Restore MongoDB from backup

# Deployment
npm run deploy           # Full deployment script
npm run cli              # CLI interface
```

## Client Setup

### Directory Structure
```
client/
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # UI component library
│   │   ├── Header.jsx   # Header component
│   │   └── Sidebar.jsx  # Navigation sidebar
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.js   # Authentication hook
│   │   ├── useFetch.js  # Data fetching hook
│   │   ├── useAsync.js  # Async operations
│   │   ├── useToast.js  # Toast notifications
│   │   └── useLocalStorage.js
│   ├── services/        # API services
│   │   └── api.js       # API client
│   ├── layouts/         # Layout components
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   ├── store/           # Zustand state management
│   ├── utils/           # Utility functions
│   │   ├── formatters.js
│   │   ├── helpers.js
│   │   ├── chartConfig.js
│   │   ├── constants.js
│   │   └── ...
│   ├── config.js        # Client config
│   ├── App.jsx          # Main app component
│   └── main.jsx         # App entry point
├── .env.example         # Environment template
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
└── nginx.conf
```

## Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://admin:password123@localhost:27017/ai_cost_intelligence?authSource=admin
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Starting the Application

### With Docker Compose (Recommended)
```bash

```

### Local Development

**Terminal 1 - MongoDB**
```bash
docker run -d -p 27017:27017 mongo:7-jammy
```

**Terminal 2 - Redis**
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

**Terminal 3 - Server**
```bash
cd server
npm install
npm run dev
```

**Terminal 4 - Client**
```bash
cd client
npm install
npm run dev
```

## Database Seeding

To populate the database with sample data:

```bash
cd server
npm run seed
```

This will create:
- 2 sample organizations
- 3 sample users (admin, manager, engineer)
- 30 days of AI usage records
- 30 days of infrastructure records
- 20 days of vector storage records

Sample credentials:
- Email: admin@acme.com
- Password: SecurePassword123

## Key Features

### Authentication
- JWT-based authentication
- Role-based access control (Admin, FinOps Manager, Engineer, Viewer)
- Secure password hashing with bcrypt
- Token refresh mechanism

### AI Cost Tracking
- Real-time usage ingestion
- Multi-provider support (OpenAI, Anthropic, Google, Meta)
- Token counting and cost calculation
- Usage by team and application

### Analytics & Reporting
- Cost trends analysis
- Provider comparison
- Token distribution analysis
- Monthly spend forecasting
- Dashboard statistics

### Infrastructure Monitoring
- GPU/Chip utilization tracking
- Infrastructure cost monitoring
- Multi-provider support (AWS, GCP, Azure)

### Vector Storage Management
- Embedding token tracking
- Storage monitoring
- Cost allocation

### Alerting & Governance
- Cost alerts and budgets
- High usage notifications
- Shadow AI detection
- Guardrails and limits

### Subscription-Based Access Control
- Three-tier subscription system (Starter, Pro, Enterprise)
- Feature gating based on subscription tier
- Automatic upgrade prompts for locked features
- Subscription management API endpoints
- User subscription tracking in database

#### Subscription Tiers:
- **Starter ($29/month)**: Basic features for small teams
- **Pro ($99/month)**: Advanced analytics and guardrails
- **Enterprise ($299/month)**: Full feature set with SSO

#### Feature Access:
- Basic analytics: All tiers
- Advanced analytics: Pro & Enterprise
- Guardrails & alerts: Pro & Enterprise
- Shadow AI detection: Pro & Enterprise
- Cost forecasting: Pro & Enterprise
- SSO/SAML: Enterprise only
- Custom integrations: Enterprise only

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### Usage
- `POST /api/usage/ingest` - Ingest usage data
- `GET /api/usage` - Get usage records

### Analytics
- `GET /api/analytics/cost-trends` - Get trends
- `GET /api/analytics/cost-by-provider` - Get provider costs
- `GET /api/analytics/token-distribution` - Get token distribution
- `GET /api/analytics/predict-spend` - Predict spending

### Organizations
- `GET /api/organizations` - List organizations
- `POST /api/organizations` - Create organization
- `GET /api/organizations/:id` - Get organization
- `PUT /api/organizations/:id` - Update organization

### Subscription Management
- `GET /api/subscription/info` - Get user's subscription info
- `GET /api/subscription/tiers` - Get all subscription tiers
- `POST /api/subscription/upgrade` - Upgrade subscription tier
- `POST /api/subscription/cancel` - Cancel subscription

## Troubleshooting

### MongoDB Connection Failed
- Ensure MongoDB is running: `docker ps`
- Check MONGO_URI in .env
- Verify credentials

### Redis Connection Failed
- Ensure Redis is running: `docker ps`
- Check REDIS_URL in .env
- Verify Redis port (default: 6379)

### Port Already in Use
```bash
# Kill process on port 5000 (server)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (client)
lsof -ti:3000 | xargs kill -9
```

### API CORS Issues
- Update CORS_ORIGIN in server .env
- Ensure client VITE_API_URL is correct

## Performance Optimization

- Redis caching for analytics
- Database indexing on frequently queried fields
- Background job processing with Node-Cron
- Rate limiting on API endpoints
- Request validation and sanitization

## Security Features

- Environment variables for sensitive data
- JWT token validation
- Input validation and sanitization
- Role-based access control
- Rate limiting
- CORS protection
- Password hashing with bcrypt

## Development

### Adding a New Feature

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create route in `src/routes/`
4. Add service logic in `src/services/`
5. Create React component in `client/src/components/`
6. Add API service in `client/src/services/api.js`
7. Create hook if needed in `client/src/hooks/`

### Testing
```bash
npm test                # Run tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

## Deployment

### Docker Build & Push
```bash
# Server
docker build -t your-registry/ai-cost-server:latest ./server
docker push your-registry/ai-cost-server:latest

# Client
docker build -t your-registry/ai-cost-client:latest ./client
docker push your-registry/ai-cost-client:latest
```

### Kubernetes Deployment
```bash
kubectl apply -f k8s/
```

## Documentation

- API Documentation: `/api/docs`
- Components: `client/src/components/ui/`
- Services: `server/src/services/`
- Models: `server/src/models/`

## Support & Maintenance

- Regular dependency updates
- Security patches
- Performance monitoring
- Database backups
- Log rotation

## License

MIT

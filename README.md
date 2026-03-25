# Costlytic

A production-grade SaaS platform for managing and optimizing AI infrastructure costs. Track LLM tokens, GPU/TPU usage, and vector database costs across your organization.

## Features

### Core Functionality
- **Multi-tenant SaaS**: Organization-based workspaces with role-based access control
- **AI Usage Ingestion**: REST API for ingesting usage data from various AI providers
- **Cost Attribution**: Hierarchical cost tracking (Organization → Team → Application → Agent)
- **Infrastructure Monitoring**: GPU/TPU utilization and cost tracking
- **Vector Database Costs**: Monitor storage and query costs for RAG systems
- **Shadow AI Detection**: Identify unauthorized AI tool usage
- **Automated Guardrails**: Cost optimization rules and alerts
- **Analytics Dashboard**: Real-time cost insights and forecasting

### Supported Providers
- **LLM Providers**: OpenAI, Anthropic, Google, Meta
- **Infrastructure**: NVIDIA GPUs, AWS Inferentia2, AWS Trainium, Google TPUs
- **Vector Databases**: Pinecone, Weaviate, Milvus

## Tech Stack

### Frontend
- Next.js 15 + React 18
- Tailwind CSS + ShadCN UI
- Chart.js for data visualization
- Zustand for state management
- Next.js routing

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- Redis for caching
- JWT authentication
- BullMQ for background jobs

### DevOps
- Docker containerization
- Docker Compose for local development
- Environment-based configuration

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Redis
- Docker & Docker Compose (optional)

### Local Development

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd ai-cost-intelligence
   ```

2. **Environment setup:**
   ```bash
   npm install
   ```

3. **Start services:**
   ```bash
   npm run dev
   ```

4. **Seed data:**
   ```bash
   cd server
   npm run seed
   ```

5. **Access the application:**
   - App: http://localhost:3000
   - API: http://localhost:3000/api

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d --build
```

## Deployment

### Vercel Deployment

The Next.js app is configured to deploy from the repo root.

Use these Vercel settings:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output directory: leave blank
- Install command: `npm install`

If you want to point the app at an external backend, set this environment variable in Vercel:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

If you keep the backend inside the Next app, you can leave `NEXT_PUBLIC_API_URL` unset and the app will use `/api`.

### Backend

The Express API is also mounted into the Next app through `pages/api/[...path].js`, so you do not need a separate backend deployment unless you prefer one.

If you do deploy the API separately, use:

```bash
NODE_ENV=production
PORT=6000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-production-secret
REDIS_URL=your-redis-url
FRONTEND_URL=https://your-frontend-domain.com
CORS_ORIGIN=https://your-frontend-domain.com
```

If you use Google OAuth, also set:

```bash
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://your-backend-domain.com/api/auth/google/callback
```

## API Documentation

### Authentication
```bash
POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile
```

### Usage Ingestion
```bash
POST /api/usage/ingest
GET /api/usage
GET /api/usage/team/:team
GET /api/usage/application/:application
```

### Analytics
```bash
GET /api/analytics/dashboard
GET /api/analytics/spend-by-provider
GET /api/analytics/cost-by-team
GET /api/analytics/token-trends
GET /api/analytics/forecast
```

### Organizations
```bash
POST /api/organizations
GET /api/organizations
GET /api/organizations/:id
PUT /api/organizations/:id
```

## Usage Example

### Ingest AI Usage Data
```bash
curl -X POST http://localhost:3000/api/usage/ingest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "provider": "openai",
    "model": "gpt-4o",
    "tokens_input": 1200,
    "tokens_output": 800,
    "team": "support",
    "application": "chatbot",
    "agent": "ticket_resolver",
    "request_id": "req_123",
    "timestamp": "2024-01-15T10:30:00Z"
  }'
```

## Project Structure

```
ai-cost-intelligence/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Zustand stores
│   │   └── services/      # API service functions
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── services/      # Business logic services
│   │   ├── utils/         # Utility functions
│   │   └── seed/          # Database seeding
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## Development

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Code Quality
```bash
# Lint code
cd client && npm run lint
cd server && npm run lint

# Format code
cd client && npm run format
cd server && npm run format
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

## Roadmap

### Phase 1: Visibility (Current)
- [x] Usage ingestion APIs
- [x] Basic analytics dashboard
- [x] Cost tracking

### Phase 2: Allocation
- [ ] Unit economics calculations
- [ ] Team cost attribution
- [ ] Cost per business metric

### Phase 3: Governance
- [ ] Automated budgets
- [ ] Token limits
- [ ] Agent guardrails
- [ ] Cost optimization recommendations

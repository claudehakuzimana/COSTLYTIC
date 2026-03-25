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
- React 18 + Vite
- Tailwind CSS + ShadCN UI
- Chart.js for data visualization
- Zustand for state management
- React Router for navigation

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
   # Backend
   cd server
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret

   # Frontend
   cd ../client
   npm install
   ```

3. **Start services:**
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d

   # Or manually:
   # Terminal 1: MongoDB
   mongod

   # Terminal 2: Redis
   redis-server

   # Terminal 3: Backend
   cd server && npm run dev

   # Terminal 4: Frontend
   cd client && npm run dev
   ```

4. **Seed data:**
   ```bash
   cd server
   npm run seed
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d --build
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
curl -X POST http://localhost:5000/api/usage/ingest \
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
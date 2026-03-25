# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+
- Docker (for MongoDB and Redis)

### Step 1: Start Database Services (2 minutes)

```bash
# Start MongoDB
docker run -d -p 27017:27017 --name ai-cost-mongo mongo:7-jammy

# Start Redis
docker run -d -p 6379:6379 --name ai-cost-redis redis:7-alpine

# Verify they're running
docker ps
```

### Step 2: Seed Database (30 seconds)

```bash
cd server
npm run seed
```

Expected output:
```
✅ Database seeding completed successfully!

📌 Sample credentials:
   Email: admin@acme.com
   Password: SecurePassword123
```

### Step 3: Start API + frontend (easiest — avoids Vite `ECONNREFUSED` proxy errors)

From the **project root** (not `client` only):

```bash
npm install
npm run dev
```

This runs the API on **port 6000** and Vite on **3000** together. If you only run `npm run dev` inside `client`, the proxy has nothing to connect to until the API is running.

### Step 3 (alternate): two terminals

**Terminal A — backend**

```bash
cd server
npm install
npm run dev
```

**Terminal B — frontend**

```bash
cd client
npm install
npm run dev
```

Expected API output:
```
Server running on port 6000
MongoDB connected successfully
```

Expected Vite output:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### Step 4: Login (1 minute)

1. Open http://localhost:3000
2. Click "Sign in"
3. Enter credentials:
   - Email: `admin@acme.com`
   - Password: `SecurePassword123`
4. You should be redirected to the Dashboard

## ✅ Verification

If everything is working, you should see:
- ✅ Landing page with modern design
- ✅ Login page with clean form
- ✅ Dashboard with stats and charts
- ✅ Sidebar navigation working
- ✅ User menu in header

## 🧪 Optional: Test Backend

```bash
# From project root
node test-backend.js
```

This will verify:
- Server is running
- Database is connected
- Authentication works
- Seeded data is accessible

## 🛑 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker ps | grep mongo

# If not running, start it
docker start ai-cost-mongo
```

### Redis Connection Failed
```bash
# Check if Redis is running
docker ps | grep redis

# If not running, start it
docker start ai-cost-redis
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Frontend Shows Blank Page
1. Check browser console for errors
2. Verify backend is running on port 5000
3. Check `.env` file in client folder has correct API URL
4. Clear browser cache and reload

## 📚 What's Next?

After logging in, explore:
- **Dashboard** - Overview of AI spending
- **AI Usage** - Detailed usage analytics
- **Token Attribution** - Cost breakdown by team
- **Infrastructure** - GPU/TPU monitoring
- **Vector Storage** - Vector database costs
- **Shadow AI** - Unauthorized AI detection
- **Guardrails** - Budget limits and alerts
- **Forecasting** - Cost predictions
- **Settings** - User preferences
- **Upgrade** - Subscription management

## 💰 Subscription Tiers & Feature Access

The application uses a subscription-based access control system with three tiers:

### Starter ($29/month)
- Basic AI usage tracking
- Basic analytics and dashboards
- Email support
- Up to 5 users
- 1 organization

### Pro ($99/month) 
- All Starter features, plus:
- Advanced analytics and provider breakdowns
- Team collaboration features
- Guardrails and budget alerts
- Shadow AI detection
- Cost forecasting
- Priority support
- Unlimited organizations
- Up to 50 users

### Enterprise ($299/month)
- All Pro features, plus:
- Unlimited users
- SSO & SAML integration
- Custom integrations
- Dedicated support
- SLA guarantee
- Advanced security features
- Custom workflows

### Feature Access by Tier

| Feature | Starter | Pro | Enterprise |
|---------|---------|-----|-----------|
| Basic Analytics | ✅ | ✅ | ✅ |
| Advanced Analytics | ❌ | ✅ | ✅ |
| Team Collaboration | ❌ | ✅ | ✅ |
| Guardrails & Alerts | ❌ | ✅ | ✅ |
| Shadow AI Detection | ❌ | ✅ | ✅ |
| Cost Forecasting | ❌ | ✅ | ✅ |
| SSO/SAML | ❌ | ❌ | ✅ |
| Custom Integrations | ❌ | ❌ | ✅ |
| Dedicated Support | ❌ | ❌ | ✅ |

### Testing Different Tiers
The seed data includes users with different subscription tiers:
- **admin@acme.com** (Enterprise tier)
- **manager@acme.com** (Pro tier) 
- **engineer@acme.com** (Starter tier)

Use the **Upgrade** page to explore different subscription options and see how feature gating works.

## 🎨 Design Features

The app now features:
- Modern, clean design inspired by Stripe and Linear
- Inter font for professional typography
- Generous whitespace and breathing room
- Card-based layouts with subtle shadows
- Orange accent color throughout
- Responsive mobile design
- Dark mode ready (can be enabled)

## 📖 Full Documentation

- `SETUP.md` - Complete setup guide
- `REVIEW_SUMMARY.md` - Functionality verification
- `FUNCTIONALITY_TEST.md` - Detailed test report
- `README.md` - Project overview

## 🆘 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review `SETUP.md` for detailed configuration
3. Check `FUNCTIONALITY_TEST.md` for known issues
4. Verify all environment variables are set correctly

## 🎉 Success!

You now have a fully functional Costlytic platform with:
- ✅ Modern, professional UI with orange theme
- ✅ Complete authentication system  
- ✅ Subscription-based access control with 3 tiers
- ✅ Feature gating based on subscription tier
- ✅ Sample data for testing all features
- ✅ All features accessible with proper subscription
- ✅ Responsive design for all devices

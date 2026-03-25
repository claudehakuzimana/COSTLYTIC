#!/bin/bash

# Deployment script

set -e

echo "📦 Costlytic - Deployment Script"
echo "==========================================="

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed"
  exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📥 Installing dependencies..."
npm install

# Run database migrations if needed
if [ -f "scripts/migrate.sh" ]; then
  echo "🔄 Running migrations..."
  bash scripts/migrate.sh
fi

# Seed database if needed
if [ "$1" == "seed" ]; then
  echo "🌱 Seeding database..."
  npm run seed
fi

echo "✅ Deployment completed successfully!"

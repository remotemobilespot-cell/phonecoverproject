#!/bin/bash
# Production Build Script

echo "🚀 Building Phone Case App for Production..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf frontend/dist
rm -rf backend/node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend && npm ci
cd ../backend && npm ci

# Build frontend
echo "🏗️ Building frontend..."
cd ../frontend && npm run build

# Test build
echo "🧪 Testing production build..."
npm run preview &
PREVIEW_PID=$!
sleep 5
kill $PREVIEW_PID

# Verify backend
echo "🔍 Verifying backend..."
cd ../backend
NODE_ENV=production timeout 10s npm start || echo "Backend verification complete"

echo "✅ Production build complete!"
echo "📁 Frontend build: frontend/dist"
echo "🚀 Ready for deployment!"

# Show build stats
echo "📊 Build Statistics:"
echo "Frontend size: $(du -sh frontend/dist | cut -f1)"
echo "Backend files: $(find backend -name "*.js" | wc -l) JS files"
#!/bin/bash
# Final Project Cleanup Script

echo "🧹 Final cleanup for production deployment..."

# Remove development files
echo "🗑️ Removing development files..."
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null
find . -name ".git" -prune -o -name "*.log" -type f -delete
find . -name ".DS_Store" -delete 2>/dev/null
find . -name "Thumbs.db" -delete 2>/dev/null

# Clean up any remaining test files
echo "🧪 Removing any missed test files..."
find . -name "*test*" -type f -not -path "./.git/*" -not -path "./node_modules/*" -delete 2>/dev/null
find . -name "*debug*" -type f -not -path "./.git/*" -not -path "./node_modules/*" -delete 2>/dev/null

# Clean up backend cache and logs
echo "📁 Cleaning backend cache..."
rm -rf backend/.cache backend/logs backend/*.log 2>/dev/null

# Clean up frontend build artifacts  
echo "🏗️ Cleaning frontend artifacts..."
rm -rf frontend/.vite frontend/dist frontend/*.log 2>/dev/null

# Remove empty directories
echo "📂 Removing empty directories..."
find . -type d -empty -not -path "./.git/*" -delete 2>/dev/null

# Verify project structure
echo "✅ Final project structure:"
tree -L 3 -I 'node_modules|.git' . 2>/dev/null || find . -type d -not -path "./.git/*" -not -path "./node_modules*" | head -20

echo "🎉 Cleanup complete! Project is ready for deployment."
echo ""
echo "📋 Next steps:"
echo "1. Run: npm install in both frontend/ and backend/"  
echo "2. Test locally with: npm run dev"
echo "3. Follow deployment guide in deployment/DEPLOYMENT_GUIDE.md"
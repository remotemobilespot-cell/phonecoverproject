# Custom Phone Case Print App

A full-stack web application for custom phone case printing with MagSafe support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Case
```

2. Install dependencies:
```bash
# Frontend
cd frontend && npm install

# Backend  
cd ../backend && npm install
```

3. Set up environment variables:
```bash
# Copy and fill the environment template
cp .env.example .env
```

4. Set up database:
```bash
# Run the database setup script in Supabase SQL editor
# File: database/setup.sql
```

5. Start development servers:
```bash
# Terminal 1 - Frontend (http://localhost:5173)
cd frontend && npm run dev

# Terminal 2 - Backend (http://localhost:5000)  
cd backend && npm start
```

## 🏗️ Project Structure

```
Case/
├── frontend/          # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and configurations
│   │   └── types/         # TypeScript type definitions
├── backend/           # Express.js backend API
│   ├── src/routes/        # API route handlers
│   └── index.js           # Server entry point
└── database/          # Database schema and migrations
```

## ✨ Features

- **Phone Case Designer**: Upload images and customize phone cases
- **MagSafe Support**: Choose between Regular ($20) and MagSafe ($30) cases  
- **Payment Processing**: Secure Stripe integration
- **Order Management**: Admin dashboard for order tracking
- **Store Locations**: Find nearby printing locations
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS + shadcn/ui
- React Router
- Supabase client

**Backend:**
- Node.js + Express
- Supabase PostgreSQL
- Stripe payments
- CORS enabled

## 📦 Deployment

See deployment guides in the `/deployment` folder for platform-specific instructions.

## 🔧 Configuration

### Environment Variables

**Frontend (.env):**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key  
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

**Backend (.env):**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `PORT` - Server port (default: 5000)

## 🚀 Production Build

```bash
# Build frontend
cd frontend && npm run build

# The backend runs directly with: npm start
```

## 📄 License

MIT License - see LICENSE file for details.
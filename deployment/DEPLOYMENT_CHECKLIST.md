# 🚀 Deployment Checklist

## ✅ Pre-Deployment Checklist

### **Code Quality**
- [ ] All console.log statements removed from production code
- [ ] Error handling implemented for all API calls  
- [ ] Loading states added to all forms and buttons
- [ ] Input validation on frontend and backend
- [ ] CORS configured for production domains
- [ ] Rate limiting implemented on API endpoints

### **Environment Setup**  
- [ ] `.env.example` file created with all required variables
- [ ] Production environment variables configured
- [ ] Supabase project created and configured
- [ ] Stripe account set up with webhooks
- [ ] Database schema deployed (run `database/setup.sql`)
- [ ] Storage bucket created in Supabase ("designs")

### **Testing**
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors (`npm start`)
- [ ] All forms submit correctly
- [ ] Payment flow works end-to-end
- [ ] Image upload functionality tested
- [ ] Admin dashboard accessible
- [ ] Mobile responsiveness verified

### **Security**
- [ ] All API keys stored in environment variables
- [ ] No sensitive data in Git repository
- [ ] HTTPS enforced on all endpoints
- [ ] Input sanitization implemented
- [ ] File upload restrictions in place

### **Performance**
- [ ] Images optimized for web
- [ ] Bundle size analyzed and optimized
- [ ] Database queries optimized with indexes
- [ ] Caching headers configured
- [ ] CDN configured for static assets

---

## 🎯 Platform-Specific Setup

### **1. Vercel (Frontend)**
- [ ] GitHub repository connected
- [ ] Root directory set to `frontend`  
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables configured:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_STRIPE_PUBLISHABLE_KEY`

### **2. Railway (Backend)**  
- [ ] GitHub repository connected
- [ ] Root directory set to `backend`
- [ ] Start command: `npm start`
- [ ] Environment variables configured:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`

### **3. Supabase (Database)**
- [ ] Project created with strong password
- [ ] SQL schema executed from `database/setup.sql`
- [ ] Row Level Security (RLS) policies verified
- [ ] Storage bucket "designs" created and configured
- [ ] API keys noted and configured in applications

---

## 🚀 Deployment Commands

```bash
# 1. Clean and prepare
./deployment/final-cleanup.sh

# 2. Install dependencies  
cd frontend && npm install
cd ../backend && npm install

# 3. Test production build
./deployment/build-production.sh

# 4. Deploy frontend (Vercel)
# Push to main branch - auto deploys

# 5. Deploy backend (Railway)  
# Push to main branch - auto deploys

# 6. Update API URLs in frontend
# Update paymentApi.ts with Railway backend URL
```

---

## 🔧 Post-Deployment Verification

### **Frontend Tests**
- [ ] Homepage loads correctly
- [ ] Navigation works  
- [ ] Print flow works (select phone → upload → edit → checkout)
- [ ] Admin login works
- [ ] Responsive design verified

### **Backend Tests**  
- [ ] API endpoints respond correctly
- [ ] Payment processing works
- [ ] Image upload works
- [ ] Database operations successful
- [ ] Error logging functional

### **Integration Tests**
- [ ] End-to-end order flow
- [ ] Payment webhook processing  
- [ ] Email notifications (if implemented)
- [ ] Admin order management
- [ ] Image storage and retrieval

---

## 🎉 Launch Ready!

When all checkboxes are ✅, your phone case printing app is ready for production!

**Estimated deployment time:** 30-45 minutes  
**Monthly cost:** $5-10 for starter tier  
**Scaling:** Automatic with chosen platforms
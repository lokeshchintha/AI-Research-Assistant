# API Routes Update - Removed /api Prefix

This document outlines the changes made to remove the `/api` prefix from all API routes.

## Summary

All API routes have been updated to remove the `/api` prefix. Routes now start directly from the root path.

---

## Backend Changes

### 1. Server Configuration (`backend/server.js`)

**Before:**
```javascript
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);
```

**After:**
```javascript
app.use('/auth', authRoutes);
app.use('/papers', paperRoutes);
```

---

## Frontend Changes

### 1. Axios Configuration (`frontend/src/lib/axios.js`)

**Before:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // ...
});
```

**After:**
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  // ...
});
```

### 2. Environment Variables (`frontend/.env.example`)

**Created new file:**
```env
# Backend API URL (without /api prefix)
VITE_API_URL=http://localhost:5000
```

---

## Updated API Endpoints

### Authentication Routes

| Old Endpoint | New Endpoint |
|-------------|-------------|
| `POST /api/auth/register` | `POST /auth/register` |
| `POST /api/auth/login` | `POST /auth/login` |
| `GET /api/auth/me` | `GET /auth/me` |

### Paper Routes

| Old Endpoint | New Endpoint |
|-------------|-------------|
| `POST /api/papers/upload` | `POST /papers/upload` |
| `GET /api/papers` | `GET /papers` |
| `GET /api/papers/:id` | `GET /papers/:id` |
| `DELETE /api/papers/:id` | `DELETE /papers/:id` |
| `POST /api/papers/:id/summary` | `POST /papers/:id/summary` |
| `POST /api/papers/:id/ideas` | `POST /papers/:id/ideas` |
| `POST /api/papers/:id/graph` | `POST /papers/:id/graph` |
| `POST /api/papers/:id/insights` | `POST /papers/:id/insights` |
| `POST /api/papers/:id/quiz` | `POST /papers/:id/quiz` |
| `POST /api/papers/:id/slides` | `POST /papers/:id/slides` |
| `POST /api/papers/:id/chat` | `POST /papers/:id/chat` |
| `GET /api/papers/:id/collaborators` | `GET /papers/:id/collaborators` |
| `POST /api/papers/:id/collaborators` | `POST /papers/:id/collaborators` |
| `DELETE /api/papers/:id/collaborators/:userId` | `DELETE /papers/:id/collaborators/:userId` |

---

## Testing the Changes

### 1. Backend Testing

Start the backend server:
```bash
cd backend
npm run dev
```

Test the root endpoint:
```bash
curl http://localhost:5000/
```

Expected response:
```json
{
  "message": "AI Research Partner API",
  "version": "1.0.0"
}
```

Test authentication:
```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Frontend Testing

Start the frontend:
```bash
cd frontend
npm run dev
```

Test the application:
1. Navigate to `http://localhost:5173`
2. Register a new account
3. Login with credentials
4. Upload a paper
5. Verify all features work correctly

---

## Environment Configuration

### Development

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-research-partner
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000
```

### Production

**Backend:**
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
# ... other production variables
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend:**
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## Migration Checklist

- [x] Updated backend route prefixes in `server.js`
- [x] Updated frontend axios baseURL in `lib/axios.js`
- [x] Created frontend `.env.example` file
- [x] Verified no hardcoded `/api/` paths in frontend
- [x] Verified no hardcoded `/api/` paths in backend
- [x] Updated rate limiter path
- [x] Documented all endpoint changes

---

## Important Notes

### 1. No Code Changes Required in:
- Individual route files (`authRoutes.js`, `paperRoutes.js`)
- Frontend store files (`useAuthStore.js`, `usePaperStore.js`)
- Frontend page components
- Controllers

The changes are centralized in:
- Backend: `server.js` (route mounting)
- Frontend: `lib/axios.js` (base URL)

### 2. Backward Compatibility
The old `/api/*` routes will **NOT** work anymore. All clients must use the new routes without the `/api` prefix.

### 3. CORS Configuration
Make sure CORS is properly configured in `server.js` to allow requests from your frontend domain.

### 4. Rate Limiting
Rate limiting now applies to all routes (changed from `/api/` to `/`).

---

## Troubleshooting

### Issue: 404 Not Found

**Problem:** API calls returning 404 errors

**Solution:**
1. Check that backend is running on correct port
2. Verify `VITE_API_URL` in frontend `.env`
3. Clear browser cache and restart frontend dev server
4. Check network tab in browser DevTools for actual URLs being called

### Issue: CORS Errors

**Problem:** CORS policy blocking requests

**Solution:**
1. Verify `FRONTEND_URL` in backend `.env`
2. Check CORS configuration in `server.js`
3. Ensure credentials are properly set

### Issue: Authentication Not Working

**Problem:** Token not being sent with requests

**Solution:**
1. Check axios interceptor in `lib/axios.js`
2. Verify token is stored in localStorage
3. Check Authorization header in network requests

---

## Summary of Changes

**Files Modified:**
1. `backend/server.js` - Route prefixes
2. `frontend/src/lib/axios.js` - Base URL

**Files Created:**
1. `frontend/.env.example` - Environment template
2. `API_ROUTES_UPDATE.md` - This documentation

**Total Changes:** Minimal and centralized for easy maintenance

---

## Contact & Support

If you encounter any issues after this update:
1. Check this documentation first
2. Verify environment variables are set correctly
3. Test with curl commands to isolate frontend/backend issues
4. Check browser console and server logs for errors

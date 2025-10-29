# 🔧 Troubleshooting Guide

## ❌ **Common Issues and Solutions**

### 1. **AI Insights Not Showing**

**Symptoms:**
- Click "Generate Insights" but nothing happens
- Error message appears
- Loading forever

**Solutions:**

✅ **Check Backend is Running:**
```bash
cd backend
npm run dev
```
Should see: `✅ MongoDB Connected` and `🚀 Server running on port 5000`

✅ **Check Frontend .env File:**
```bash
# frontend/.env should exist with:
VITE_API_URL=http://localhost:5000/api
```

✅ **Check Browser Console:**
- Open DevTools (F12)
- Look for API call logs
- Check for errors

✅ **Verify Gemini API Key:**
```bash
# backend/.env should have valid key:
GEMINI_API_KEY=AIza...YOUR_KEY
```

✅ **Test API Directly:**
```bash
# In terminal:
curl -X POST http://localhost:5000/api/papers/YOUR_PAPER_ID/insights \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

### 2. **Quiz Not Working**

**Symptoms:**
- Quiz doesn't generate
- Questions don't appear
- Can't submit answers

**Solutions:**

✅ **Same as Insights** - Follow steps above

✅ **Check Paper Has Text:**
- Paper must have extracted text
- Try re-uploading the PDF

✅ **Check Console Logs:**
```javascript
// Browser console should show:
Calling quiz API: http://localhost:5000/api/papers/ID/quiz
Quiz response status: 200
Quiz response data: { success: true, data: [...] }
```

---

### 3. **Collaborate Not Working**

**Symptoms:**
- Can't add collaborators
- Real-time notes don't sync
- Active users count stuck at 1

**Solutions:**

✅ **Check Socket.io Connection:**
```javascript
// Browser console:
// Should NOT see socket connection errors
```

✅ **Verify Backend Socket.io:**
```bash
# Backend terminal should show:
📡 Socket.io ready for real-time collaboration
```

✅ **Check CORS Settings:**
```javascript
// backend/server.js should have:
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
```

✅ **Test Collaborator Email:**
- Email must exist in database
- User must be registered

---

### 4. **Chat History Not Persisting**

**Symptoms:**
- Chats disappear after logout
- Old conversations not loading

**Solutions:**

✅ **Check Paper Model:**
```javascript
// backend/models/Paper.js should have:
chatHistory: [{
  question: String,
  answer: String,
  timestamp: Date,
}]
```

✅ **Verify Database Save:**
```bash
# MongoDB should show chatHistory field
mongosh
use ai-research-partner
db.papers.findOne({}, { chatHistory: 1 })
```

---

### 5. **Features Not in Sidebar**

**Symptoms:**
- Only "Upload" and "My Papers" visible
- Feature buttons don't appear

**Solutions:**

✅ **Open a Paper First:**
- Features only appear when viewing a paper
- Navigate to any paper detail page

✅ **Check URL:**
```
Should be: /paper/:id or /graph/:id or /ideas/:id
Not: /papers or /upload
```

---

## 🐛 **Debug Checklist**

### Backend Issues:

- [ ] Backend server running (`npm run dev`)
- [ ] MongoDB connected (see ✅ in terminal)
- [ ] `.env` file exists in backend folder
- [ ] All environment variables set
- [ ] Gemini API key valid
- [ ] Cloudinary credentials correct
- [ ] No errors in backend terminal

### Frontend Issues:

- [ ] Frontend running (`npm run dev`)
- [ ] `.env` file exists in frontend folder
- [ ] `VITE_API_URL` set correctly
- [ ] Browser console shows no errors
- [ ] Network tab shows successful API calls
- [ ] Token stored in localStorage

### Feature-Specific:

**Insights:**
- [ ] Paper has extracted text
- [ ] Gemini API responding
- [ ] insights field in Paper model

**Quiz:**
- [ ] Paper has content
- [ ] quiz field in Paper model
- [ ] Questions generating (check console)

**Collaborate:**
- [ ] Socket.io connected
- [ ] Collaborator exists in DB
- [ ] Real-time events firing

---

## 🔍 **How to Debug**

### Step 1: Check Backend Logs
```bash
cd backend
npm run dev

# Look for:
✅ MongoDB Connected
🚀 Server running on port 5000
📡 Socket.io ready
```

### Step 2: Check Frontend Console
```javascript
// Open DevTools (F12) → Console
// Should see API calls:
Calling insights API: http://localhost:5000/api/papers/ID/insights
Insights response status: 200
```

### Step 3: Test API Manually
```bash
# Get your token from localStorage
# Then test:
curl -X POST http://localhost:5000/api/papers/PAPER_ID/insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Check Database
```bash
mongosh
use ai-research-partner
db.papers.findOne()
# Should see: insights, quiz, chatHistory fields
```

---

## 🆘 **Quick Fixes**

### "Cannot connect to server"
```bash
# Restart backend
cd backend
npm run dev
```

### "Insights/Quiz not generating"
```bash
# Check Gemini API key
cd backend
cat .env | grep GEMINI_API_KEY
```

### "Collaborate not syncing"
```bash
# Check Socket.io
# Backend should show:
📡 Socket.io ready for real-time collaboration
```

### "Features not in sidebar"
```
# Open any paper first
# Then features will appear
```

---

## 📞 **Still Not Working?**

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Restart both servers**
3. **Check all .env files exist**
4. **Verify MongoDB is running**
5. **Check browser console for errors**
6. **Check backend terminal for errors**

---

## ✅ **Verification Commands**

```bash
# Backend health check
curl http://localhost:5000

# Frontend health check
curl http://localhost:5173

# MongoDB check
mongosh --eval "db.version()"

# Check if paper exists
mongosh ai-research-partner --eval "db.papers.countDocuments()"
```

---

**If all else fails, restart everything:**
```bash
# Stop all servers (Ctrl+C)
# Then:
cd backend && npm run dev
# New terminal:
cd frontend && npm run dev
```

# Upload Troubleshooting Guide

## Common Upload Issues & Solutions

### 1. Check Backend is Running

```bash
# In backend directory
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📡 Socket.io ready for real-time collaboration
✅ MongoDB Connected
```

### 2. Check Frontend Environment

**Create/Update `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000
```

**Restart frontend after creating .env:**
```bash
cd frontend
npm run dev
```

### 3. Test Upload Endpoint Manually

**Using curl (with a test PDF):**
```bash
curl -X POST http://localhost:5000/papers \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "pdf=@/path/to/your/file.pdf" \
  -F "title=Test Paper"
```

### 4. Check Browser Console

Open browser DevTools (F12) and check:
1. **Console tab** - Look for JavaScript errors
2. **Network tab** - Check the upload request:
   - URL should be: `http://localhost:5000/papers` (NOT `/api/papers`)
   - Method: POST
   - Status: Should be 201 (Created)
   - Response: Should contain paper data

### 5. Common Error Messages

#### "Network Error" or "Failed to fetch"
**Problem:** Backend not running or wrong URL

**Solution:**
```bash
# Check backend is running
cd backend
npm run dev

# Check frontend .env file
cat frontend/.env
# Should show: VITE_API_URL=http://localhost:5000
```

#### "401 Unauthorized"
**Problem:** Not logged in or token expired

**Solution:**
1. Logout and login again
2. Check localStorage in browser DevTools:
   - Application tab → Local Storage
   - Should have `token` and `user` keys

#### "400 Bad Request - Please upload a PDF file"
**Problem:** File not being sent correctly

**Solution:**
- Ensure you're selecting a PDF file
- Check file size (should be reasonable, < 10MB recommended)
- Try a different PDF file

#### "500 Internal Server Error"
**Problem:** Backend processing error

**Solution:**
Check backend console for detailed error:
- PDF parsing error?
- Cloudinary upload error?
- Gemini API error?
- MongoDB error?

### 6. Verify Dependencies

**Backend:**
```bash
cd backend
npm install
```

Required packages:
- multer (file upload)
- cloudinary (file storage)
- pdf-parse (PDF text extraction)
- @google/generative-ai (Gemini API)

**Frontend:**
```bash
cd frontend
npm install
```

Required packages:
- react-dropzone (file upload UI)
- axios (HTTP client)

### 7. Check Environment Variables

**Backend `.env` must have:**
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

**Frontend `.env` must have:**
```env
VITE_API_URL=http://localhost:5000
```

### 8. Test Step by Step

**Step 1: Test Backend Health**
```bash
curl http://localhost:5000/
```
Expected: `{"message":"AI Research Partner API","version":"1.0.0"}`

**Step 2: Test Authentication**
```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

Copy the token from login response.

**Step 3: Test Upload**
```bash
curl -X POST http://localhost:5000/papers \
  -H "Authorization: Bearer YOUR_TOKEN_FROM_STEP_2" \
  -F "pdf=@test.pdf" \
  -F "title=Test Paper"
```

### 9. Check CORS Configuration

In `backend/server.js`, verify CORS is configured:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

### 10. Clear Browser Cache

Sometimes old cached data causes issues:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+Delete to clear cache

### 11. Check File Upload Middleware

Verify `backend/middleware/upload.js` exists and is configured correctly:
```javascript
import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

export default upload;
```

### 12. Debug Mode

Add console logs to track the upload:

**Frontend (`usePaperStore.js`):**
```javascript
uploadPaper: async (file, title) => {
  console.log('Starting upload:', { fileName: file.name, title });
  set({ isUploading: true });
  try {
    const formData = new FormData();
    formData.append('pdf', file);
    if (title) formData.append('title', title);
    
    console.log('Sending request to:', '/papers');
    const { data } = await api.post('/papers', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    console.log('Upload successful:', data);
    // ... rest of code
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error response:', error.response?.data);
    // ... rest of code
  }
}
```

**Backend (`paperController.js`):**
```javascript
export const uploadPaper = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file ? 'Present' : 'Missing');
    console.log('Body:', req.body);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      });
    }
    
    // ... rest of code
  } catch (error) {
    console.error('Upload error details:', error);
    // ... rest of code
  }
};
```

### 13. Quick Fix Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] `frontend/.env` has `VITE_API_URL=http://localhost:5000`
- [ ] Logged in with valid token
- [ ] Selecting a valid PDF file
- [ ] File size < 10MB
- [ ] MongoDB connected
- [ ] Cloudinary credentials configured
- [ ] Gemini API key configured
- [ ] Browser console shows no errors
- [ ] Network tab shows request to `http://localhost:5000/papers`

### 14. Still Not Working?

**Restart everything:**
```bash
# Stop all servers (Ctrl+C)

# Backend
cd backend
rm -rf node_modules
npm install
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules
npm install
npm run dev
```

**Check specific error in backend console:**
- Look for the exact error message
- Check if it's a Cloudinary error, Gemini error, or MongoDB error
- Verify all API keys are correct

### 15. Contact Support

If still failing, provide:
1. Backend console output
2. Frontend browser console errors
3. Network tab screenshot of failed request
4. Your environment setup (OS, Node version, etc.)

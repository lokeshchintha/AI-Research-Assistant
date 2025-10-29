# 🎯 Getting Started with AI Research Partner

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] **Node.js** v18+ installed ([Download](https://nodejs.org/))
- [ ] **MongoDB** installed or Atlas account ([Setup](https://www.mongodb.com/))
- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Code Editor** (VS Code recommended)
- [ ] **Gemini API Key** ([Get Key](https://makersuite.google.com/app/apikey))
- [ ] **Cloudinary Account** ([Sign Up](https://cloudinary.com/))

## 🚀 5-Minute Quick Start

### Step 1: Clone & Install (2 minutes)
```bash
# Navigate to project
cd reseachpartner

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment (2 minutes)

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-research-partner
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production_min_32_chars
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
CLOUDINARY_CLOUD_NAME=YOUR_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_API_KEY
CLOUDINARY_API_SECRET=YOUR_API_SECRET
FRONTEND_URL=http://localhost:5173
```

**Frontend** - Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Access Application
Open browser: **http://localhost:5173**

---

## 🎓 First-Time User Guide

### 1. Create Your Account
1. Click **"Sign up"** on the login page
2. Enter your name, email, and password (min 6 characters)
3. Click **"Create Account"**
4. You'll be automatically logged in

### 2. Upload Your First Paper
1. Click **"Upload Paper"** button
2. Drag & drop a PDF file (or click to browse)
3. Optionally edit the title
4. Click **"Upload & Analyze"**
5. Wait 10-30 seconds for processing

### 3. Generate AI Summary
1. Open your uploaded paper
2. Click **"Generate Summary"**
3. Wait for AI processing (30-60 seconds)
4. Toggle between Basic/Medium/Technical levels
5. Expand/collapse sections as needed

### 4. Ask Questions
1. Scroll to the "Ask Anything" chat box
2. Type your question about the paper
3. Press Enter or click Send
4. Get AI-powered answers instantly

### 5. Explore Knowledge Graph
1. Navigate to the paper's graph page
2. Click **"Generate Graph"**
3. Interact with the visualization:
   - Drag nodes to rearrange
   - Click nodes for details
   - Zoom in/out with mouse wheel

### 6. Generate Research Ideas
1. Go to the Ideas page for your paper
2. Click **"Generate Research Ideas"**
3. Review 3-5 AI-generated suggestions
4. Each idea includes:
   - Novelty rating
   - Feasibility assessment
   - Methodology
   - Expected outcomes

### 7. Collaborate with Others
1. Open the Collaborate page
2. Enter a collaborator's email
3. Click Add
4. Share notes in real-time
5. See active users and typing indicators

---

## 🎨 User Interface Overview

### Main Navigation (Sidebar)
```
┌─────────────────────┐
│  AI Research        │  Logo & Title
│  Partner            │
├─────────────────────┤
│ 📤 Upload           │  Upload new papers
│ 📄 My Papers        │  View all papers
│ 🕸️  Knowledge Graph │  Visualize concepts
│ 💡 Research Ideas   │  AI suggestions
│ 👥 Collaborate      │  Real-time work
├─────────────────────┤
│ 👤 User Profile     │  Your info
│ 🚪 Logout           │  Sign out
└─────────────────────┘
```

### Paper Detail Page Layout
```
┌─────────────────────────────────────────┐
│  Paper Title                    [Share] │
│  Keywords: AI, ML, Deep Learning        │
├─────────────────────────────────────────┤
│                          │              │
│  Smart Summary           │  Ask         │
│  ┌──────────────────┐   │  Anything    │
│  │ Basic | Medium | │   │  ┌────────┐  │
│  │    Technical     │   │  │ Chat   │  │
│  └──────────────────┘   │  │ Box    │  │
│                          │  └────────┘  │
│  ▼ Abstract              │              │
│  ▼ Introduction          │  [Send]      │
│  ▼ Methods               │              │
│  ▼ Results               │              │
│  ▼ Conclusion            │              │
└─────────────────────────────────────────┘
```

---

## 🔑 Key Features at a Glance

| Feature | What It Does | Time to Generate |
|---------|--------------|------------------|
| **Upload** | Extract text from PDF | 10-30 seconds |
| **Summary** | Multi-level summaries | 30-60 seconds |
| **Q&A** | Ask questions | 5-10 seconds |
| **Ideas** | Research suggestions | 20-40 seconds |
| **Graph** | Visual concept map | 15-30 seconds |
| **Citations** | Similar papers | 20-30 seconds |
| **Slides** | Presentation content | 20-30 seconds |
| **Collaborate** | Real-time notes | Instant |

---

## 💡 Pro Tips for Best Results

### For Better Summaries
- ✅ Upload clear, text-based PDFs (not scanned images)
- ✅ Papers with clear section headings work best
- ✅ Use "Basic" for quick overview, "Technical" for details

### For Better Q&A
- ✅ Ask specific questions about the paper
- ✅ Reference sections: "What does the methods section say about..."
- ✅ Ask for explanations: "Explain the main contribution in simple terms"

### For Better Ideas
- ✅ Generate ideas after reviewing the summary
- ✅ Look for "High Novelty + High Feasibility" combinations
- ✅ Consider the required resources listed

### For Better Collaboration
- ✅ Add collaborators before starting work
- ✅ Use notes for important observations
- ✅ Check active users before making changes

---

## 🎯 Common Use Cases

### 1. Literature Review
```
1. Upload multiple papers
2. Generate summaries for each
3. Compare key findings
4. Generate knowledge graphs
5. Find citation recommendations
```

### 2. Research Proposal
```
1. Upload related papers
2. Generate research ideas
3. Review feasibility ratings
4. Export ideas for proposal
5. Generate citations
```

### 3. Paper Understanding
```
1. Upload paper
2. Generate summary (start with Basic)
3. Ask clarifying questions
4. View knowledge graph
5. Explore related concepts
```

### 4. Team Collaboration
```
1. Upload paper
2. Add team members
3. Share notes and observations
4. Discuss in real-time
5. Generate ideas together
```

---

## 🐛 Troubleshooting Quick Fixes

### "Cannot connect to server"
```bash
# Check if backend is running
cd backend
npm run dev
```

### "MongoDB connection failed"
```bash
# Start MongoDB
mongod

# Or check Atlas connection string
```

### "Upload failed"
```bash
# Check file size (max 10MB)
# Ensure file is PDF format
# Verify Cloudinary credentials in .env
```

### "AI features not working"
```bash
# Verify Gemini API key in backend/.env
# Check API quota at Google AI Studio
# Review backend terminal for errors
```

---

## 📚 Learning Resources

### Video Tutorials (Recommended)
1. **MongoDB Basics** - [MongoDB University](https://university.mongodb.com/)
2. **React Fundamentals** - [React.dev](https://react.dev/learn)
3. **Express.js Guide** - [Express Documentation](https://expressjs.com/)
4. **D3.js Visualization** - [D3 Graph Gallery](https://d3-graph-gallery.com/)

### Documentation
- [Full API Reference](./API_DOCUMENTATION.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

## 🎉 Next Steps

Now that you're set up:

1. ✅ **Upload a test paper** - Try with a small research paper
2. ✅ **Explore all features** - Test each AI capability
3. ✅ **Invite a friend** - Try collaboration features
4. ✅ **Customize the code** - Make it your own
5. ✅ **Deploy to production** - Share with the world

---

## 🆘 Need Help?

### Quick Help
- Check [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for common tasks
- Review [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details

### Community Support
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute improvements via Pull Requests

---

## 🌟 You're Ready!

You now have everything you need to:
- ✅ Analyze research papers with AI
- ✅ Generate summaries and insights
- ✅ Visualize knowledge graphs
- ✅ Collaborate in real-time
- ✅ Generate research ideas

**Start exploring and happy researching! 🚀**

---

*Built with ❤️ for students and researchers worldwide*

# 🎯 How to Use All Features

## Navigation Flow

The application now has a **paper-centric navigation** where all features are accessible from the paper detail page.

### Main Flow:
```
Login/Register → Papers List → Upload Paper → Paper Detail Page
                                                      ↓
                        ┌─────────────────────────────┼─────────────────────────────┐
                        ↓                             ↓                             ↓
                Knowledge Graph              Research Ideas                  Collaborate
```

## 📝 Step-by-Step Usage

### 1. **Getting Started**

**First Time Setup:**
1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`

**Create Account:**
1. Click "Sign up"
2. Enter name, email, password
3. Click "Create Account"

### 2. **Upload a Paper**

1. Click **"Upload Paper"** button (top right or sidebar)
2. Drag & drop a PDF file (max 10MB)
3. Optionally edit the title
4. Click **"Upload & Analyze"**
5. Wait for processing (10-30 seconds)

**What happens:**
- PDF text is extracted
- File is uploaded to Cloudinary
- Keywords are extracted using AI
- Paper is saved to database

### 3. **View Paper Summary**

After uploading, you'll be on the **Paper Detail** page.

**Generate Summary:**
1. Click **"Generate Summary"** button
2. Wait 30-60 seconds for AI processing
3. Toggle between **Basic**, **Medium**, **Technical** levels
4. Click section headers to expand/collapse

**Summary Levels:**
- **Basic**: Simple language for high school students
- **Medium**: Balanced for undergraduates
- **Technical**: Full technical detail

**Sections Included:**
- Abstract
- Introduction
- Methods/Methodology
- Results
- Conclusion
- Key Findings

### 4. **Ask Questions (Q&A Chat)**

On the Paper Detail page, use the **"Ask Anything"** chatbox:

1. Type your question in the input field
2. Press Enter or click Send
3. Wait 5-10 seconds for AI response
4. Chat history is maintained during session

**Example Questions:**
- "What is the main contribution of this paper?"
- "Explain the methodology in simple terms"
- "What are the key results?"
- "What are the limitations mentioned?"

### 5. **Knowledge Graph**

From Paper Detail page, click **"Graph"** button.

**Generate Graph:**
1. Click **"Generate Graph"** button
2. Wait 15-30 seconds
3. Interact with the visualization

**Interactions:**
- **Drag nodes**: Click and drag to reposition
- **Zoom**: Mouse wheel or pinch gesture
- **Pan**: Click and drag background
- **Click nodes**: View detailed information
- **Legend**: Shows concept categories

**Color Coding:**
- 🔵 Blue: Methods
- 🟣 Purple: Results
- 🔴 Pink: Concepts
- 🟢 Green: Applications
- 🟡 Yellow: Related topics

### 6. **Research Ideas**

From Paper Detail page, click **"Ideas"** button.

**Generate Ideas:**
1. Click **"Generate Research Ideas"**
2. Wait 20-40 seconds
3. Review 3-5 AI-generated ideas

**Each Idea Includes:**
- **Title**: Concise research direction
- **Description**: 2-3 sentence overview
- **Novelty**: Low/Medium/High
- **Feasibility**: Low/Medium/High
- **AI Relevance**: Low/Medium/High
- **Methodology**: Suggested approach
- **Expected Outcome**: Potential results
- **Resources**: Required tools/data

**How to Use:**
- Look for **High Novelty + High Feasibility** combinations
- Consider your available resources
- Use as starting points for proposals

### 7. **Collaborate**

From Paper Detail page, click **"Collaborate"** button.

**Add Collaborators:**
1. Enter collaborator's email
2. Click Add (➕) button
3. They can now access the paper

**Real-time Features:**
- **Shared Notes**: All collaborators see updates instantly
- **Active Users**: Green indicator shows who's online
- **Typing Indicator**: See when others are typing
- **Live Updates**: Notes appear in real-time

**How to Collaborate:**
1. Add team members by email
2. Share observations in notes
3. Discuss findings in real-time
4. All notes are saved permanently

### 8. **Additional Features**

**From Paper Detail Page:**

**Generate Citations:**
```javascript
// API call (automatic in future)
POST /api/papers/:id/citations
```
Returns 5 similar papers with titles, authors, abstracts

**Generate Slides:**
```javascript
POST /api/papers/:id/slides
```
Returns 8-10 presentation slides with bullet points

**Generate Abstract:**
```javascript
POST /api/papers/:id/abstract
```
Returns new 150-200 word academic abstract

## 🎯 Navigation Between Features

**From any feature page**, use the top navigation buttons:

```
┌─────────────────────────────────────────────┐
│ ← Back  │  Summary │ Graph │ Ideas │ Collab │
└─────────────────────────────────────────────┘
```

- **← Back**: Return to Paper Detail
- **Summary**: View paper summary and Q&A
- **Graph**: Knowledge graph visualization
- **Ideas**: Research idea suggestions
- **Collab**: Real-time collaboration

## 📱 Quick Actions

### From Papers List:
- **View**: Open paper detail
- **Delete**: Remove paper (⚠️ permanent)

### From Paper Detail:
- **Graph**: Generate/view knowledge graph
- **Ideas**: Generate/view research ideas
- **Collaborate**: Add collaborators and notes

## 🔄 Typical Workflows

### **Workflow 1: Understanding a Paper**
```
1. Upload Paper
2. Generate Summary
3. Read Basic level first
4. Progress to Technical
5. Ask questions in chat
6. View Knowledge Graph
```

### **Workflow 2: Research Proposal**
```
1. Upload related papers
2. Generate summaries for each
3. Generate research ideas
4. Review feasibility ratings
5. Generate citations
6. Export ideas for proposal
```

### **Workflow 3: Team Research**
```
1. Upload paper
2. Generate summary
3. Add team members
4. Share observations in notes
5. Discuss ideas in real-time
6. Generate research ideas together
```

### **Workflow 4: Literature Review**
```
1. Upload multiple papers
2. Generate summaries
3. View knowledge graphs
4. Compare key concepts
5. Generate citations
6. Identify research gaps
```

## 💡 Tips for Best Results

### **For Summaries:**
- ✅ Start with Basic level for overview
- ✅ Use Technical for detailed analysis
- ✅ Expand sections one at a time
- ✅ Use Key Findings for quick reference

### **For Q&A:**
- ✅ Ask specific questions
- ✅ Reference sections: "What does methods say about..."
- ✅ Request explanations: "Explain X in simple terms"
- ✅ Follow up on answers

### **For Knowledge Graph:**
- ✅ Drag nodes to organize by topic
- ✅ Click nodes for details
- ✅ Look for clusters of related concepts
- ✅ Use zoom for detailed view

### **For Research Ideas:**
- ✅ Generate after reading summary
- ✅ Focus on High Novelty ideas
- ✅ Check feasibility for your context
- ✅ Review required resources

### **For Collaboration:**
- ✅ Add collaborators early
- ✅ Use notes for key observations
- ✅ Check active users before discussions
- ✅ Notes are permanent - use wisely

## 🚀 Advanced Features

### **Batch Processing:**
Upload multiple papers and process them sequentially for literature review.

### **Export Options:**
- Download original PDF
- Copy generated abstracts
- Export research ideas
- Save knowledge graph (screenshot)

### **Search & Filter:**
- Search papers by title
- Filter by keywords
- Sort by date

## ⚠️ Important Notes

1. **Paper IDs**: All features require a paper ID - access them from Paper Detail page
2. **AI Processing**: Takes 10-60 seconds depending on feature
3. **File Limits**: PDFs must be under 10MB
4. **Real-time**: Collaboration requires both users to be online
5. **Persistence**: All data is saved automatically

## 🆘 Troubleshooting

**Feature not loading?**
- Ensure you're on the Paper Detail page first
- Check if paper has been uploaded successfully
- Refresh the page

**AI generation failed?**
- Check Gemini API key in backend .env
- Verify API quota hasn't been exceeded
- Try again after a few seconds

**Collaboration not working?**
- Ensure backend server is running
- Check Socket.io connection in browser console
- Verify both users are logged in

**Graph not displaying?**
- Generate the graph first
- Check browser console for errors
- Try refreshing the page

---

**Enjoy your AI Research Partner! 🎓**

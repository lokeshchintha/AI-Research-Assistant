# 🧠 AI Research Partner

A powerful web application that helps students analyze, understand, and ideate from research papers using AI. Built with React, Express.js, MongoDB, and Google's Gemini AI.

![AI Research Partner](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)

## ✨ Features

### 📄 Upload & Extract
- **Drag & drop PDF upload** with visual feedback
- **Automatic text extraction** from research papers
- **Cloud storage** via Cloudinary
- **Smart keyword extraction** using Gemini AI

### 📊 Smart Summary Dashboard
- **Multi-level summaries**: Basic, Medium, and Technical
- **Section-wise analysis**: Abstract, Introduction, Methods, Results, Conclusion
- **Key findings extraction**
- **Interactive Q&A chatbot** for paper-specific questions

### 🕸️ AI Knowledge Graph
- **D3.js-powered interactive visualization** of concepts
- **Clickable nodes** with detailed information
- **Drag-and-drop** node repositioning
- **Zoom and pan** capabilities
- **Color-coded categories** for different concept types

### 💡 Research Idea Generator
- **AI-generated research ideas** based on uploaded papers
- **3-5 innovative suggestions** per paper
- **Tagged with**:
  - Novelty level (Low/Medium/High)
  - Feasibility (Low/Medium/High)
  - AI Relevance (Low/Medium/High)
- **Methodology and expected outcomes** for each idea
- **Resource requirements** listing

### 📚 Citation Recommender
- **Similar paper suggestions** with titles and abstracts
- **Author information** and publication years
- **Direct links** to Google Scholar

### 📝 Abstract & Slide Creator
- **Generate new abstracts** for papers
- **PPT content generation** with structured slides
- **Export-ready format**

### 👥 Collaborative Mode
- **Real-time collaboration** using Socket.io
- **Shared notes** with live updates
- **Active user indicators**
- **Typing indicators**
- **Invite collaborators** via email

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **D3.js** for data visualization
- **Zustand** for state management
- **Axios** for API calls
- **Socket.io Client** for real-time features
- **React Router** for navigation
- **React Dropzone** for file uploads
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** for text generation
- **Socket.io** for WebSocket connections
- **Cloudinary** for file storage
- **PDF-Parse** for text extraction
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Helmet** for security
- **Rate limiting** for API protection

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Google Gemini API key

### 1. Clone the Repository
```bash
git clone <repository-url>
cd reseachpartner
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-research-partner

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Get API Keys

#### Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into backend `.env`

#### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add to backend `.env`

### 5. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** and update the `MONGODB_URI` in `.env`

### 6. Run the Application

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

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🎨 UI Design

### Dark Mode Theme
- **Background**: Deep dark (#0a0a0f)
- **Cards**: Dark gray (#13131a)
- **Accents**: Neon blue (#00d4ff), purple (#b537f2), pink (#ff006e)

### Features
- **Smooth animations** with Framer Motion
- **Responsive design** for all screen sizes
- **Glassmorphism effects**
- **Neon glow shadows**
- **Floating AI chat icon**
- **Sidebar navigation**

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/login` | User authentication |
| `/register` | New user registration |
| `/upload` | Upload research papers |
| `/papers` | View all uploaded papers |
| `/paper/:id` | Paper details with summary and Q&A |
| `/ideas/:id` | Research ideas for a paper |
| `/graph/:id` | Knowledge graph visualization |
| `/collaborate/:id` | Real-time collaboration |

## 🔐 Authentication

- **JWT-based authentication**
- **Bcrypt password hashing**
- **Protected routes** on frontend and backend
- **Token stored** in localStorage
- **Automatic token refresh**

## 🚀 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Papers
- `GET /api/papers` - Get all papers
- `POST /api/papers` - Upload new paper
- `GET /api/papers/:id` - Get single paper
- `DELETE /api/papers/:id` - Delete paper
- `POST /api/papers/:id/summary` - Generate summary
- `POST /api/papers/:id/ideas` - Generate research ideas
- `POST /api/papers/:id/knowledge-graph` - Generate knowledge graph
- `POST /api/papers/:id/citations` - Generate citations
- `POST /api/papers/:id/slides` - Generate slides
- `POST /api/papers/:id/abstract` - Generate abstract
- `POST /api/papers/:id/ask` - Ask question about paper
- `POST /api/papers/:id/collaborators` - Add collaborator
- `POST /api/papers/:id/notes` - Add note

## 🤖 Gemini AI Prompts

The application uses carefully crafted prompts for different AI tasks:

### Summary Generation
```
Summarize the following [section] section from a research paper 
in [basic/medium/technical] language...
```

### Idea Generation
```
Based on the following research paper, generate 5 innovative 
research ideas with novelty, feasibility, and AI relevance ratings...
```

### Q&A
```
You are an AI assistant helping students understand a research paper.
Answer the following question based on the paper content...
```

## 📊 Database Models

### User
- name, email, password
- avatar, papers
- collaborations

### Paper
- title, fileUrl, extractedText
- owner, collaborators
- summary, ideas, keywords
- knowledgeGraph, citations, notes

### Summary
- paper reference
- section summaries (basic, medium, technical)
- keyFindings, generatedSlides, generatedAbstract

### Idea
- paper reference
- title, description
- tags (novelty, feasibility, aiRelevance)
- methodology, expectedOutcome, resources

## 🔧 Configuration

### Backend Configuration
- **Port**: 5000 (configurable)
- **Rate limiting**: 100 requests per 15 minutes
- **File upload limit**: 10MB
- **CORS**: Configured for frontend URL

### Frontend Configuration
- **Vite dev server**: Port 5173
- **Proxy**: API requests proxied to backend
- **Build output**: `dist/` directory

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] PDF upload and text extraction
- [ ] Summary generation at all levels
- [ ] Research idea generation
- [ ] Knowledge graph visualization
- [ ] Q&A chatbot functionality
- [ ] Real-time collaboration
- [ ] Adding collaborators
- [ ] Shared notes
- [ ] Paper deletion

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables
2. Update MongoDB URI to production database
3. Deploy using Git or CLI

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Set `VITE_API_URL` to production backend URL

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in `.env`

**Gemini API Error**
- Verify API key is correct
- Check API quota limits

**File Upload Fails**
- Check Cloudinary credentials
- Verify file size is under 10MB

**Socket.io Not Connecting**
- Ensure backend server is running
- Check CORS configuration

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- Google Gemini AI for text generation
- D3.js for visualization
- Cloudinary for file storage
- MongoDB for database
- React and Express communities

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for students and researchers**

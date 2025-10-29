# 📁 Project Structure

```
reseachpartner/
│
├── backend/                          # Express.js Backend
│   ├── config/                       # Configuration files
│   │   ├── cloudinary.js            # Cloudinary setup
│   │   ├── database.js              # MongoDB connection
│   │   └── gemini.js                # Gemini AI setup
│   │
│   ├── controllers/                  # Route controllers
│   │   ├── authController.js        # Authentication logic
│   │   └── paperController.js       # Paper CRUD & AI features
│   │
│   ├── middleware/                   # Express middleware
│   │   ├── auth.js                  # JWT authentication
│   │   ├── errorHandler.js          # Error handling
│   │   └── upload.js                # Multer file upload
│   │
│   ├── models/                       # Mongoose models
│   │   ├── User.js                  # User schema
│   │   ├── Paper.js                 # Paper schema
│   │   ├── Summary.js               # Summary schema
│   │   └── Idea.js                  # Research idea schema
│   │
│   ├── routes/                       # API routes
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── paperRoutes.js           # Paper endpoints
│   │
│   ├── services/                     # Business logic
│   │   ├── geminiService.js         # AI text generation
│   │   └── pdfService.js            # PDF processing
│   │
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore rules
│   ├── package.json                  # Dependencies
│   └── server.js                     # Entry point
│
├── frontend/                         # React Frontend
│   ├── public/                       # Static assets
│   │
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── KnowledgeGraph.jsx   # D3.js graph visualization
│   │   │   ├── Layout.jsx           # Main layout with sidebar
│   │   │   ├── Loader.jsx           # Loading spinner
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   │
│   │   ├── lib/                     # Utilities
│   │   │   ├── axios.js             # API client setup
│   │   │   └── socket.js            # Socket.io client
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Upload.jsx           # PDF upload page
│   │   │   ├── Papers.jsx           # Papers list page
│   │   │   ├── PaperDetail.jsx      # Paper detail with Q&A
│   │   │   ├── Ideas.jsx            # Research ideas page
│   │   │   ├── Graph.jsx            # Knowledge graph page
│   │   │   └── Collaborate.jsx      # Real-time collaboration
│   │   │
│   │   ├── store/                   # State management
│   │   │   ├── useAuthStore.js      # Auth state (Zustand)
│   │   │   └── usePaperStore.js     # Paper state (Zustand)
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   │
│   ├── .env.example                  # Environment template
│   ├── .gitignore                    # Git ignore rules
│   ├── index.html                    # HTML template
│   ├── package.json                  # Dependencies
│   ├── postcss.config.js            # PostCSS config
│   ├── tailwind.config.js           # Tailwind config
│   └── vite.config.js               # Vite config
│
├── README.md                         # Main documentation
├── SETUP_GUIDE.md                    # Detailed setup instructions
├── API_DOCUMENTATION.md              # API reference
└── PROJECT_STRUCTURE.md              # This file
```

## 🎯 Key Files Explained

### Backend

**server.js**
- Express app initialization
- Socket.io setup for real-time features
- Middleware configuration
- Route mounting
- Error handling

**config/gemini.js**
- Google Gemini AI initialization
- Model configuration
- API key management

**services/geminiService.js**
- AI text generation functions
- Summary generation (3 levels)
- Research idea generation
- Q&A functionality
- Keyword extraction
- Citation recommendations

**services/pdfService.js**
- PDF text extraction
- Cloudinary upload/delete
- File processing

**models/**
- MongoDB schemas with Mongoose
- Data validation
- Relationships between collections

**controllers/paperController.js**
- Main business logic for papers
- Handles all AI feature generation
- Collaboration management

### Frontend

**App.jsx**
- React Router setup
- Route definitions
- Protected route wrapping
- Toast notifications

**components/Layout.jsx**
- Sidebar navigation
- Header with user info
- Responsive design
- Logout functionality

**components/KnowledgeGraph.jsx**
- D3.js force-directed graph
- Interactive node manipulation
- Zoom and pan
- Node information panel

**store/usePaperStore.js**
- Paper state management
- API calls for all paper operations
- AI feature generation
- Real-time updates

**pages/PaperDetail.jsx**
- Paper summary display
- Multi-level summary toggle
- AI chatbot integration
- Section expansion/collapse

**pages/Collaborate.jsx**
- Real-time collaboration
- Socket.io integration
- Shared notes
- Active user tracking

## 📦 Dependencies

### Backend Core
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **socket.io**: Real-time communication
- **@google/generative-ai**: Gemini AI SDK
- **jsonwebtoken**: Authentication
- **bcryptjs**: Password hashing
- **multer**: File uploads
- **pdf-parse**: PDF text extraction
- **cloudinary**: File storage

### Backend Security & Utilities
- **helmet**: Security headers
- **cors**: Cross-origin requests
- **express-rate-limit**: Rate limiting
- **express-validator**: Input validation
- **dotenv**: Environment variables

### Frontend Core
- **react**: UI library
- **react-dom**: React rendering
- **react-router-dom**: Routing
- **vite**: Build tool
- **axios**: HTTP client
- **socket.io-client**: WebSocket client

### Frontend UI & Visualization
- **tailwindcss**: Styling
- **framer-motion**: Animations
- **d3**: Data visualization
- **lucide-react**: Icons
- **react-dropzone**: File uploads
- **react-hot-toast**: Notifications

### Frontend State Management
- **zustand**: State management

## 🔄 Data Flow

### Upload Flow
```
User uploads PDF
    ↓
Frontend sends to /api/papers
    ↓
Backend receives file
    ↓
Extract text with pdf-parse
    ↓
Upload to Cloudinary
    ↓
Extract keywords with Gemini
    ↓
Save to MongoDB
    ↓
Return paper data to frontend
```

### Summary Generation Flow
```
User clicks "Generate Summary"
    ↓
Frontend calls /api/papers/:id/summary
    ↓
Backend extracts sections with Gemini
    ↓
Generate 3 levels (basic, medium, technical)
    ↓
Save to MongoDB
    ↓
Return summary to frontend
    ↓
Display with level toggle
```

### Real-time Collaboration Flow
```
User joins paper page
    ↓
Frontend connects to Socket.io
    ↓
Emit 'join-paper' event
    ↓
Backend adds to room
    ↓
User sends note
    ↓
Backend broadcasts to room
    ↓
All users receive update
```

## 🎨 Styling Architecture

### Tailwind Configuration
- Custom colors (neon-blue, neon-purple, neon-pink)
- Dark theme defaults
- Custom animations (float, pulse-slow)
- Responsive breakpoints

### CSS Components
- `.btn-primary`: Gradient buttons
- `.btn-secondary`: Outlined buttons
- `.card`: Base card style
- `.card-glow`: Card with neon shadow
- `.input-field`: Styled inputs
- `.neon-text`: Gradient text
- `.sidebar-link`: Navigation links

## 🔐 Security Features

- JWT authentication with 30-day expiration
- Bcrypt password hashing (10 rounds)
- Protected API routes
- CORS configuration
- Helmet security headers
- Rate limiting (100 req/15min)
- File size limits (10MB)
- File type validation (PDF only)
- Input sanitization

## 🚀 Performance Optimizations

- Lazy loading of routes
- Debounced search/input
- Memoized components
- Optimized D3.js rendering
- Connection pooling (MongoDB)
- Cloudinary CDN for files
- Vite build optimization
- Code splitting

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Responsive grid layouts

## 🧪 Testing Considerations

### Backend Testing
- Unit tests for services
- Integration tests for routes
- Mock Gemini AI responses
- Database seeding for tests

### Frontend Testing
- Component unit tests
- Integration tests with React Testing Library
- E2E tests with Playwright/Cypress
- Visual regression tests

## 📊 Database Schema

### Collections
1. **users**: User accounts
2. **papers**: Research papers
3. **summaries**: AI-generated summaries
4. **ideas**: Research ideas

### Relationships
- User → Papers (one-to-many)
- Paper → Summary (one-to-one)
- Paper → Ideas (one-to-many)
- Paper → Collaborators (many-to-many)

## 🔧 Configuration Files

- **backend/.env**: Backend environment variables
- **frontend/.env**: Frontend environment variables
- **tailwind.config.js**: Tailwind customization
- **vite.config.js**: Vite build configuration
- **postcss.config.js**: PostCSS plugins
- **package.json**: Dependencies and scripts

## 📈 Scalability Considerations

- Stateless backend (horizontal scaling)
- MongoDB sharding support
- Redis for session storage (future)
- CDN for static assets
- Load balancing ready
- Microservices architecture potential

import mongoose from 'mongoose';

const paperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  cloudinaryId: String,
  extractedText: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  summary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Summary',
  },
  ideas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
  }],
  keywords: [String],
  knowledgeGraph: {
    nodes: [{
      id: String,
      label: String,
      group: Number,
    }],
    links: [{
      source: String,
      target: String,
      value: Number,
    }],
  },
  citations: [{
    title: String,
    authors: [String],
    abstract: String,
    year: Number,
    url: String,
  }],
  notes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  // Feature 9: AI Insights
  insights: {
    novelty: {
      score: Number,
      description: String,
      points: [String],
    },
    methodStrength: {
      score: Number,
      description: String,
      points: [String],
    },
    practicalRelevance: {
      score: Number,
      description: String,
      points: [String],
    },
    limitations: {
      score: Number,
      description: String,
      points: [String],
    },
    overallScore: Number,
    recommendation: String,
  },
  // Feature 11: Quiz
  quiz: [{
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: String,
    topic: String,
  }],
  // Chat History (Q&A)
  chatHistory: [{
    question: String,
    answer: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  // Quiz Attempts History
  quizAttempts: [{
    quiz: [{
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
      difficulty: String,
      topic: String,
    }],
    userAnswers: [Number],
    score: Number,
    totalQuestions: Number,
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

paperSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Paper = mongoose.model('Paper', paperSchema);

export default Paper;

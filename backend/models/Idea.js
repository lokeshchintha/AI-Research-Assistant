import mongoose from 'mongoose';

const ideaSchema = new mongoose.Schema({
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    novelty: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    feasibility: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    aiRelevance: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  methodology: String,
  expectedOutcome: String,
  resources: [String],
  // Chat history for this specific idea
  chatHistory: [{
    question: String,
    answer: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  // Generated full research paper
  generatedPaper: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  generatedAt: {
    type: Date,
    default: null,
  },
  // Generated PowerPoint slides
  generatedSlides: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Idea = mongoose.model('Idea', ideaSchema);

export default Idea;

import mongoose from 'mongoose';

const summarySchema = new mongoose.Schema({
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    required: true,
  },
  abstract: {
    basic: String,
    medium: String,
    technical: String,
  },
  introduction: {
    basic: String,
    medium: String,
    technical: String,
  },
  methods: {
    basic: String,
    medium: String,
    technical: String,
  },
  results: {
    basic: String,
    medium: String,
    technical: String,
  },
  conclusion: {
    basic: String,
    medium: String,
    technical: String,
  },
  keyFindings: [String],
  generatedSlides: {
    type: String,
  },
  generatedAbstract: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Summary = mongoose.model('Summary', summarySchema);

export default Summary;

import express from 'express';
import {
  uploadPaper,
  getPapers,
  getPaper,
  generateSummary,
  generateIdeas,
  generateKnowledgeGraph,
  generateCitations,
  generateSlides,
  generateAbstract,
  askQuestion,
  addCollaborator,
  addNote,
  deletePaper,
  analyzeInsights,
  comparePapers,
  generateQuiz,
  getDashboardStats,
  deleteAllChats,
  deleteChat,
  saveQuizAttempt,
  getQuizAttempts,
  askIdeaQuestion,
  deleteIdeaChat,
  deleteAllIdeaChats,
  generateFullPaper,
  generateIdeaSlides,
  generateMoreIdeas,
  modifyIdeaPaper,
  modifyIdeaSlides,
} from '../controllers/paperController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Special routes (must come before /:id routes)
router.get('/dashboard/stats', getDashboardStats); // Feature 12: Dashboard Stats
router.post('/compare', comparePapers); // Feature 10: Compare Papers

router.route('/')
  .get(getPapers)
  .post(upload.single('pdf'), uploadPaper);

router.route('/:id')
  .get(getPaper)
  .delete(deletePaper);

// Existing features (1-8)
router.post('/:id/summary', generateSummary);
router.post('/:id/ideas', generateIdeas);
router.post('/:id/ideas/more', generateMoreIdeas); // Generate more ideas
router.post('/:id/knowledge-graph', generateKnowledgeGraph);
router.post('/:id/citations', generateCitations);
router.post('/:id/slides', generateSlides);
router.post('/:id/abstract', generateAbstract);
router.post('/:id/ask', askQuestion);
router.post('/:id/collaborators', addCollaborator);
router.post('/:id/notes', addNote);

// New features (9-11)
router.post('/:id/insights', analyzeInsights); // Feature 9: AI Insight Analyzer
router.post('/:id/quiz', generateQuiz); // Feature 11: Quiz Generator

// Chat management
router.delete('/:id/chats', deleteAllChats); // Delete all chats
router.delete('/:id/chats/:chatIndex', deleteChat); // Delete specific chat

// Quiz attempts
router.post('/:id/quiz-attempts', saveQuizAttempt); // Save quiz attempt
router.get('/:id/quiz-attempts', getQuizAttempts); // Get quiz history

// Idea chat
router.post('/ideas/:ideaId/ask', askIdeaQuestion); // Ask question about specific idea
router.delete('/ideas/:ideaId/chats', deleteAllIdeaChats); // Delete all chats for idea
router.delete('/ideas/:ideaId/chats/:chatIndex', deleteIdeaChat); // Delete specific chat

// Feature 13: Full Research Paper Generator
router.post('/ideas/:ideaId/generate-paper', generateFullPaper); // Generate full research paper from idea
router.post('/ideas/:ideaId/modify-paper', modifyIdeaPaper); // Modify existing research paper

// Feature 14: PowerPoint Slide Generator
router.post('/ideas/:ideaId/generate-slides', generateIdeaSlides); // Generate PowerPoint slides from idea
router.post('/ideas/:ideaId/modify-slides', modifyIdeaSlides); // Modify existing slides

export default router;

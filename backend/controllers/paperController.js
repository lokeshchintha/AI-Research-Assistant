import Paper from '../models/Paper.js';
import Summary from '../models/Summary.js';
import Idea from '../models/Idea.js';
import User from '../models/User.js';
import pdfService from '../services/pdfService.js';
import geminiService from '../services/geminiService.js';

// Upload and process paper
export const uploadPaper = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      });
    }

    const { title } = req.body;

    // Extract text from PDF
    const extractedText = await pdfService.extractText(req.file.buffer);

    // Upload to Cloudinary
    const { url, cloudinaryId } = await pdfService.uploadToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    // Extract keywords
    const keywords = await geminiService.extractKeywords(extractedText);

    // Create paper
    const paper = await Paper.create({
      title: title || req.file.originalname.replace('.pdf', ''),
      originalFileName: req.file.originalname,
      fileUrl: url,
      cloudinaryId,
      extractedText,
      owner: req.user._id,
      keywords,
    });

    // Add to user's papers
    await User.findByIdAndUpdate(req.user._id, {
      $push: { papers: paper._id },
    });

    res.status(201).json({
      success: true,
      data: paper,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all papers for user (owned + collaborated)
export const getPapers = async (req, res) => {
  try {
    // Find papers where user is owner OR collaborator
    const papers = await Paper.find({
      $or: [
        { owner: req.user._id },
        { 'collaborators.user': req.user._id }
      ]
    })
      .populate('summary')
      .populate('ideas')
      .populate('owner', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      count: papers.length,
      data: papers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single paper
export const getPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id)
      .populate('summary')
      .populate('ideas')
      .populate('owner', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .populate('notes.user', 'name email avatar');

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    // Check if user has access
    const hasAccess = 
      paper.owner._id.toString() === req.user._id.toString() ||
      paper.collaborators.some(c => c.user._id.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this paper',
      });
    }

    res.json({
      success: true,
      data: paper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate summary
export const generateSummary = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    // Extract sections
    const sections = await geminiService.extractSections(paper.extractedText);

    // Generate summaries at all levels
    const summaryData = {
      paper: paper._id,
      abstract: {},
      introduction: {},
      methods: {},
      results: {},
      conclusion: {},
    };

    const sectionNames = ['abstract', 'introduction', 'methods', 'results', 'conclusion'];
    const levels = ['basic', 'medium', 'technical'];

    for (const section of sectionNames) {
      if (sections[section]) {
        for (const level of levels) {
          summaryData[section][level] = await geminiService.generateSummary(
            sections[section],
            section,
            level
          );
        }
      }
    }

    // Extract key findings with bullet points
    const keyFindings = await geminiService.extractKeyFindings(paper.extractedText);
    summaryData.keyFindings = keyFindings;

    // Create or update summary
    let summary;
    if (paper.summary) {
      summary = await Summary.findByIdAndUpdate(paper.summary, summaryData, { new: true });
    } else {
      summary = await Summary.create(summaryData);
      paper.summary = summary._id;
      await paper.save();
    }

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate research ideas
export const generateIdeas = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const ideasData = await geminiService.generateResearchIdeas(paper.extractedText, 5);

    const ideas = [];
    for (const ideaData of ideasData) {
      const idea = await Idea.create({
        paper: paper._id,
        title: ideaData.title,
        description: ideaData.description,
        tags: {
          novelty: ideaData.novelty || 'Medium',
          feasibility: ideaData.feasibility || 'Medium',
          aiRelevance: ideaData.aiRelevance || 'High',
        },
        methodology: ideaData.methodology || '',
        expectedOutcome: ideaData.expectedOutcome || '',
        resources: ideaData.resources || [],
      });
      ideas.push(idea);
    }

    paper.ideas = ideas.map(i => i._id);
    await paper.save();

    res.json({
      success: true,
      data: ideas,
    });
  } catch (error) {
    console.error('Idea generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate more research ideas (append to existing)
export const generateMoreIdeas = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const { count = 3 } = req.body; // Default to 3 more ideas

    const ideasData = await geminiService.generateResearchIdeas(paper.extractedText, count);

    const ideas = [];
    for (const ideaData of ideasData) {
      const idea = await Idea.create({
        paper: paper._id,
        title: ideaData.title,
        description: ideaData.description,
        tags: {
          novelty: ideaData.novelty || 'Medium',
          feasibility: ideaData.feasibility || 'Medium',
          aiRelevance: ideaData.aiRelevance || 'High',
        },
        methodology: ideaData.methodology || '',
        expectedOutcome: ideaData.expectedOutcome || '',
        resources: ideaData.resources || [],
      });
      ideas.push(idea);
    }

    // Append to existing ideas
    paper.ideas = [...paper.ideas, ...ideas.map(i => i._id)];
    await paper.save();

    res.json({
      success: true,
      message: `${ideas.length} more ideas generated successfully`,
      data: ideas,
    });
  } catch (error) {
    console.error('Generate more ideas error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate knowledge graph
export const generateKnowledgeGraph = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const keywords = paper.keywords.length > 0 
      ? paper.keywords 
      : await geminiService.extractKeywords(paper.extractedText);

    // Create nodes
    const nodes = keywords.slice(0, 20).map((keyword, index) => ({
      id: keyword.toLowerCase().replace(/\s+/g, '-'),
      label: keyword,
      group: index % 5,
    }));

    // Create links (simplified - connect related concepts)
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      if (Math.random() > 0.6) {
        links.push({
          source: nodes[i].id,
          target: nodes[i + 1].id,
          value: Math.floor(Math.random() * 5) + 1,
        });
      }
    }

    paper.knowledgeGraph = { nodes, links };
    await paper.save();

    res.json({
      success: true,
      data: { nodes, links },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate citations
export const generateCitations = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const citations = await geminiService.generateCitations(paper.extractedText);

    paper.citations = citations;
    await paper.save();

    res.json({
      success: true,
      data: citations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate slides
export const generateSlides = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const slides = await geminiService.generateSlides(paper.extractedText);

    const summary = await Summary.findOne({ paper: paper._id });
    if (summary) {
      summary.generatedSlides = JSON.stringify(slides);
      await summary.save();
    }

    res.json({
      success: true,
      data: slides,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate abstract
export const generateAbstract = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const abstract = await geminiService.generateAbstract(paper.extractedText);

    const summary = await Summary.findOne({ paper: paper._id });
    if (summary) {
      summary.generatedAbstract = abstract;
      await summary.save();
    }

    res.json({
      success: true,
      data: abstract,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Ask question about paper
export const askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const answer = await geminiService.answerQuestion(question, paper.extractedText);

    // Save to chat history
    if (!paper.chatHistory) {
      paper.chatHistory = [];
    }
    paper.chatHistory.push({
      question,
      answer,
      timestamp: new Date(),
    });
    await paper.save();

    res.json({
      success: true,
      data: { question, answer, timestamp: new Date() },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add collaborator
export const addCollaborator = async (req, res) => {
  try {
    const { email } = req.body;
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    // Check if user is owner
    if (paper.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can add collaborators',
      });
    }

    const collaborator = await User.findOne({ email });
    if (!collaborator) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if already a collaborator
    const isCollaborator = paper.collaborators.some(
      c => c.user.toString() === collaborator._id.toString()
    );

    if (isCollaborator) {
      return res.status(400).json({
        success: false,
        message: 'User is already a collaborator',
      });
    }

    paper.collaborators.push({ user: collaborator._id });
    await paper.save();

    res.json({
      success: true,
      data: paper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add note
export const addNote = async (req, res) => {
  try {
    const { content } = req.body;
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    paper.notes.push({
      user: req.user._id,
      content,
    });

    await paper.save();

    res.json({
      success: true,
      data: paper.notes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete paper
export const deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    // Check if user is owner
    if (paper.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this paper',
      });
    }

    // Delete from Cloudinary
    if (paper.cloudinaryId) {
      await pdfService.deleteFromCloudinary(paper.cloudinaryId);
    }

    // Delete associated data
    if (paper.summary) {
      await Summary.findByIdAndDelete(paper.summary);
    }
    if (paper.ideas.length > 0) {
      await Idea.deleteMany({ _id: { $in: paper.ideas } });
    }

    await paper.deleteOne();

    res.json({
      success: true,
      message: 'Paper deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Feature 9: AI Insight Analyzer
export const analyzeInsights = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const insights = await geminiService.analyzeInsights(paper.extractedText);

    // Store insights in paper
    paper.insights = insights;
    await paper.save();

    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Insight analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Feature 10: Compare Papers
export const comparePapers = async (req, res) => {
  try {
    const { paperId1, paperId2 } = req.body;

    const paper1 = await Paper.findById(paperId1);
    const paper2 = await Paper.findById(paperId2);

    if (!paper1 || !paper2) {
      return res.status(404).json({
        success: false,
        message: 'One or both papers not found',
      });
    }

    const comparison = await geminiService.comparePapers(
      paper1.extractedText,
      paper2.extractedText,
      paper1.title,
      paper2.title
    );

    res.json({
      success: true,
      data: {
        paper1: { id: paper1._id, title: paper1.title },
        paper2: { id: paper2._id, title: paper2.title },
        comparison,
      },
    });
  } catch (error) {
    console.error('Comparison error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Feature 11: Generate Quiz
export const generateQuiz = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const questionCount = req.body.questionCount || 5;
    const quiz = await geminiService.generateQuiz(paper.extractedText, questionCount);

    // Store quiz in paper
    paper.quiz = quiz;
    await paper.save();

    res.json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Feature 12: User Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all user's papers
    const papers = await Paper.find({ owner: userId });
    
    // Count papers with different features
    const stats = {
      totalPapers: papers.length,
      summarizedPapers: papers.filter(p => p.summary).length,
      papersWithIdeas: papers.filter(p => p.ideas && p.ideas.length > 0).length,
      papersWithGraphs: papers.filter(p => p.knowledgeGraph && p.knowledgeGraph.nodes).length,
      papersWithQuiz: papers.filter(p => p.quiz && p.quiz.length > 0).length,
      totalIdeas: papers.reduce((sum, p) => sum + (p.ideas ? p.ideas.length : 0), 0),
      totalNotes: papers.reduce((sum, p) => sum + (p.notes ? p.notes.length : 0), 0),
      collaborations: papers.filter(p => p.collaborators && p.collaborators.length > 0).length,
      recentPapers: papers.slice(-5).map(p => ({
        id: p._id,
        title: p.title,
        createdAt: p.createdAt,
        hasSummary: !!p.summary,
        hasIdeas: p.ideas && p.ideas.length > 0
      })),
      uploadsByMonth: getUploadsByMonth(papers)
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Helper function for dashboard
function getUploadsByMonth(papers) {
  const monthCounts = {};
  papers.forEach(paper => {
    const month = new Date(paper.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  
  return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
}

// Delete all chats for a paper
export const deleteAllChats = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    // Clear all chat history
    paper.chatHistory = [];
    await paper.save();

    res.json({
      success: true,
      message: 'All chats deleted successfully',
    });
  } catch (error) {
    console.error('Delete all chats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete specific chat by index
export const deleteChat = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const chatIndex = parseInt(req.params.chatIndex);
    
    if (chatIndex < 0 || chatIndex >= paper.chatHistory.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat index',
      });
    }

    // Remove specific chat
    paper.chatHistory.splice(chatIndex, 1);
    await paper.save();

    res.json({
      success: true,
      message: 'Chat deleted successfully',
      data: paper.chatHistory,
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Save quiz attempt
export const saveQuizAttempt = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    const { quiz, userAnswers, score, totalQuestions } = req.body;

    // Add new attempt to history
    paper.quizAttempts.push({
      quiz,
      userAnswers,
      score,
      totalQuestions,
      completedAt: new Date(),
    });

    await paper.save();

    res.json({
      success: true,
      message: 'Quiz attempt saved successfully',
      data: paper.quizAttempts[paper.quizAttempts.length - 1],
    });
  } catch (error) {
    console.error('Save quiz attempt error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get quiz attempts history
export const getQuizAttempts = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found',
      });
    }

    res.json({
      success: true,
      data: paper.quizAttempts || [],
    });
  } catch (error) {
    console.error('Get quiz attempts error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Ask question about specific idea
export const askIdeaQuestion = async (req, res) => {
  try {
    const Idea = (await import('../models/Idea.js')).default;
    const idea = await Idea.findById(req.params.ideaId);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Question is required',
      });
    }

    // Get paper for context
    const paper = await Paper.findById(idea.paper);
    
    // Create context for the AI about this specific idea
    const ideaContext = `
Research Idea: ${idea.title}
Description: ${idea.description}
Methodology: ${idea.methodology}
Expected Outcome: ${idea.expectedOutcome}
Resources Needed: ${idea.resources.join(', ')}
Tags: Novelty-${idea.tags.novelty}, Feasibility-${idea.tags.feasibility}, AI Relevance-${idea.tags.aiRelevance}

Paper Context:
${paper.extractedText.substring(0, 5000)}
`;

    // Get answer from Gemini
    const answer = await geminiService.answerQuestion(question, ideaContext);

    // Save to idea's chat history
    idea.chatHistory.push({
      question,
      answer,
      timestamp: new Date(),
    });

    await idea.save();

    res.json({
      success: true,
      data: {
        question,
        answer,
        timestamp: idea.chatHistory[idea.chatHistory.length - 1].timestamp,
      },
    });
  } catch (error) {
    console.error('Ask idea question error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete all chats for an idea
export const deleteAllIdeaChats = async (req, res) => {
  try {
    const Idea = (await import('../models/Idea.js')).default;
    const idea = await Idea.findById(req.params.ideaId);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    idea.chatHistory = [];
    await idea.save();

    res.json({
      success: true,
      message: 'All chats deleted successfully',
    });
  } catch (error) {
    console.error('Delete all idea chats error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete specific chat from idea
export const deleteIdeaChat = async (req, res) => {
  try {
    const Idea = (await import('../models/Idea.js')).default;
    const idea = await Idea.findById(req.params.ideaId);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    const chatIndex = parseInt(req.params.chatIndex);
    
    if (chatIndex < 0 || chatIndex >= idea.chatHistory.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chat index',
      });
    }

    idea.chatHistory.splice(chatIndex, 1);
    await idea.save();

    res.json({
      success: true,
      message: 'Chat deleted successfully',
      data: idea.chatHistory,
    });
  } catch (error) {
    console.error('Delete idea chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate full research paper from idea
export const generateFullPaper = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    const paper = await Paper.findById(idea.paper);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Source paper not found',
      });
    }

    // Generate full research paper using Gemini
    const fullPaper = await geminiService.generateFullPaper(idea, paper.extractedText);

    // Save the generated paper to the idea
    idea.generatedPaper = fullPaper;
    idea.generatedAt = new Date();
    await idea.save();

    res.json({
      success: true,
      message: 'Full research paper generated successfully',
      data: fullPaper,
    });
  } catch (error) {
    console.error('Generate full paper error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Modify existing research paper
export const modifyIdeaPaper = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { modificationRequest } = req.body;

    if (!modificationRequest || !modificationRequest.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Modification request is required',
      });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    if (!idea.generatedPaper) {
      return res.status(400).json({
        success: false,
        message: 'No paper exists to modify. Generate a paper first.',
      });
    }

    const modifiedPaper = await geminiService.modifyResearchPaper(
      idea.generatedPaper,
      modificationRequest,
      idea
    );

    if (modifiedPaper.error) {
      return res.status(500).json({
        success: false,
        message: modifiedPaper.error,
      });
    }

    idea.generatedPaper = modifiedPaper;
    idea.generatedAt = new Date();
    await idea.save();

    res.json({
      success: true,
      message: 'Paper modified successfully',
      data: modifiedPaper,
    });
  } catch (error) {
    console.error('Modify paper error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Modify existing slides
export const modifyIdeaSlides = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { modificationRequest, theme, layout } = req.body;

    if (!modificationRequest || !modificationRequest.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Modification request is required',
      });
    }

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    if (!idea.generatedSlides || !idea.generatedSlides.slides) {
      return res.status(400).json({
        success: false,
        message: 'No slides exist to modify. Generate slides first.',
      });
    }

    const currentSlides = idea.generatedSlides.slides || idea.generatedSlides;
    const modifiedSlides = await geminiService.modifySlideContent(
      currentSlides,
      modificationRequest,
      idea,
      { theme, layout }
    );

    if (modifiedSlides.error) {
      return res.status(500).json({
        success: false,
        message: modifiedSlides.error,
      });
    }

    idea.generatedSlides = {
      slides: modifiedSlides,
      theme: theme || idea.generatedSlides.theme,
      layout: layout || idea.generatedSlides.layout,
      slideCount: modifiedSlides.length,
      generatedAt: new Date(),
    };
    await idea.save();

    res.json({
      success: true,
      message: 'Slides modified successfully',
      data: modifiedSlides,
    });
  } catch (error) {
    console.error('Modify slides error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Generate PowerPoint slides from idea
export const generateIdeaSlides = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { theme, layout, slideCount } = req.body;

    const idea = await Idea.findById(ideaId);
    if (!idea) {
      return res.status(404).json({
        success: false,
        message: 'Idea not found',
      });
    }

    const paper = await Paper.findById(idea.paper);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Source paper not found',
      });
    }

    // Generate slides using Gemini
    const slides = await geminiService.generateSlideContent(idea, paper.extractedText, {
      theme: theme || 'Professional',
      layout: layout || 'Mixed',
      slideCount: slideCount || 10,
    });

    // Save the generated slides to the idea
    idea.generatedSlides = {
      slides,
      theme,
      layout,
      slideCount,
      generatedAt: new Date(),
    };
    await idea.save();

    res.json({
      success: true,
      message: 'Presentation slides generated successfully',
      data: slides,
    });
  } catch (error) {
    console.error('Generate slides error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Sparkles, TrendingUp, Zap, Target, ArrowLeft, Network, Users, FileText, Brain, HelpCircle, MessageCircle, Send, X, Trash2, Info, BookOpen, Download, Presentation, Settings as SettingsIcon } from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Ideas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPaper, fetchPaper, generateIdeas, generateFullPaper, generateIdeaSlides, generateMoreIdeas, modifyIdeaPaper, modifyIdeaSlides } = usePaperStore();

  // Helper function to render text with markdown bold formatting
  const renderTextWithBold = (text) => {
    if (!text) return text;
    
    // Split by ** markers and render bold text
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Remove ** and make bold
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-bold text-white">{boldText}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [ideaQuestion, setIdeaQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [ideaChatHistory, setIdeaChatHistory] = useState([]);
  const [viewingPaper, setViewingPaper] = useState(null);
  const [viewingPaperIdea, setViewingPaperIdea] = useState(null);
  const [isGeneratingPaper, setIsGeneratingPaper] = useState(false);
  const [showSlideOptions, setShowSlideOptions] = useState(false);
  const [slideOptionsIdea, setSlideOptionsIdea] = useState(null);
  const [slideOptions, setSlideOptions] = useState({
    theme: 'Professional',
    layout: 'Mixed',
    slideCount: 10,
  });
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [viewingSlides, setViewingSlides] = useState(null);
  const [viewingSlidesIdea, setViewingSlidesIdea] = useState(null);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [paperChatInput, setPaperChatInput] = useState('');
  const [slidesChatInput, setSlidesChatInput] = useState('');
  const [showPaperChat, setShowPaperChat] = useState(false);
  const [showSlidesChat, setShowSlidesChat] = useState(false);
  const ideaChatEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchPaper(id);
    }
  }, [id, fetchPaper]);

  // Auto-scroll to bottom when new idea chat message appears
  useEffect(() => {
    if (ideaChatEndRef.current) {
      ideaChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ideaChatHistory]);

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    await generateIdeas(id);
    setIsGenerating(false);
  };

  const handleGenerateMoreIdeas = async () => {
    setIsGeneratingMore(true);
    try {
      await generateMoreIdeas(id, 3); // Generate 3 more ideas
    } catch (error) {
      console.error('Error generating more ideas:', error);
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleViewIdeaDetail = (idea) => {
    setSelectedIdea(idea);
    setIdeaChatHistory(idea.chatHistory || []);
    setViewingPaper(null);
  };

  const handleGenerateFullPaper = async (idea) => {
    setIsGeneratingPaper(true);
    try {
      const paper = await generateFullPaper(idea._id);
      setViewingPaper(paper);
      setViewingPaperIdea(idea);
    } catch (error) {
      console.error('Error generating paper:', error);
    } finally {
      setIsGeneratingPaper(false);
    }
  };

  const handleViewGeneratedPaper = (idea) => {
    setViewingPaper(idea.generatedPaper);
    setViewingPaperIdea(idea);
  };

  const handleDownloadPaper = () => {
    if (!viewingPaper || !viewingPaperIdea) return;
    
    // Create a formatted document
    let content = `# ${viewingPaperIdea.title}\n\n`;
    content += `## Abstract\n${viewingPaper.abstract}\n\n`;
    content += `## Introduction\n`;
    content += `### Background\n${viewingPaper.introduction.background}\n\n`;
    content += `### Problem Statement\n${viewingPaper.introduction.problemStatement}\n\n`;
    content += `### Objectives\n${viewingPaper.introduction.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n')}\n\n`;
    content += `### Significance\n${viewingPaper.introduction.significance}\n\n`;
    content += `## Literature Review\n`;
    content += `${viewingPaper.literatureReview.summary}\n\n`;
    content += `### Research Gaps\n${viewingPaper.literatureReview.gaps.map((gap, i) => `${i + 1}. ${gap}`).join('\n')}\n\n`;
    content += `### Research Positioning\n${viewingPaper.literatureReview.positioning}\n\n`;
    content += `## Methodology\n`;
    content += `### Approach\n${viewingPaper.methodology.approach}\n\n`;
    content += `### Methods\n${viewingPaper.methodology.methods.map((method, i) => `${i + 1}. ${method}`).join('\n')}\n\n`;
    content += `### Data Collection\n${viewingPaper.methodology.dataCollection}\n\n`;
    content += `### Analysis\n${viewingPaper.methodology.analysis}\n\n`;
    content += `### Timeline\n${viewingPaper.methodology.timeline}\n\n`;
    content += `## Expected Results\n`;
    content += `### Outcomes\n${viewingPaper.expectedResults.outcomes.map((outcome, i) => `${i + 1}. ${outcome}`).join('\n')}\n\n`;
    content += `### Metrics\n${viewingPaper.expectedResults.metrics.map((metric, i) => `${i + 1}. ${metric}`).join('\n')}\n\n`;
    content += `### Validation\n${viewingPaper.expectedResults.validation}\n\n`;
    content += `## Conclusion\n`;
    content += `${viewingPaper.conclusion.summary}\n\n`;
    content += `### Contributions\n${viewingPaper.conclusion.contributions.map((contrib, i) => `${i + 1}. ${contrib}`).join('\n')}\n\n`;
    content += `### Future Work\n${viewingPaper.conclusion.futureWork}\n\n`;
    content += `## References\n${viewingPaper.references.map((ref, i) => `${i + 1}. ${ref}`).join('\n')}`;

    // Download as markdown file
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewingPaperIdea.title.replace(/[^a-z0-9]/gi, '_')}_research_paper.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Paper downloaded!');
  };

  const handleGenerateSlides = async (idea) => {
    setIsGeneratingSlides(true);
    setShowSlideOptions(false);
    try {
      const slides = await generateIdeaSlides(idea._id, slideOptions);
      setViewingSlides(slides);
      setViewingSlidesIdea(idea);
    } catch (error) {
      console.error('Error generating slides:', error);
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  const handleViewGeneratedSlides = (idea) => {
    setViewingSlides(idea.generatedSlides.slides || idea.generatedSlides);
    setViewingSlidesIdea(idea);
  };

  const handleDownloadSlides = () => {
    if (!viewingSlides || !viewingSlidesIdea) return;
    
    // Create markdown content for slides
    let content = `# ${viewingSlidesIdea.title}\n## Presentation Slides\n\n`;
    
    viewingSlides.forEach((slide) => {
      content += `---\n\n`;
      content += `## Slide ${slide.slideNumber}: ${slide.title}\n\n`;
      if (slide.subtitle) content += `**${slide.subtitle}**\n\n`;
      
      // Add content based on layout
      if (typeof slide.content === 'string') {
        content += `${slide.content}\n\n`;
      } else if (slide.content.items) {
        slide.content.items.forEach(item => {
          content += `- ${item}\n`;
        });
        content += `\n`;
      } else if (slide.content.mainTitle) {
        content += `### ${slide.content.mainTitle}\n`;
        if (slide.content.subtitle) content += `${slide.content.subtitle}\n`;
        content += `\n`;
      } else {
        content += `${JSON.stringify(slide.content, null, 2)}\n\n`;
      }
      
      if (slide.visualSuggestion) {
        content += `**Visual Suggestion:** ${slide.visualSuggestion}\n\n`;
      }
      
      if (slide.speakerNotes) {
        content += `**Speaker Notes:** ${slide.speakerNotes}\n\n`;
      }
    });

    // Download as markdown file
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewingSlidesIdea.title.replace(/[^a-z0-9]/gi, '_')}_slides.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Slides downloaded!');
  };

  const handleAskIdeaQuestion = async () => {
    if (!ideaQuestion.trim() || !selectedIdea) return;

    const currentQuestion = ideaQuestion;
    setIdeaQuestion('');
    setIsAsking(true);

    // Add temp message
    const tempMessage = {
      question: currentQuestion,
      answer: 'Thinking...',
      timestamp: new Date(),
      isLoading: true,
    };
    setIdeaChatHistory(prev => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/papers/ideas/${selectedIdea._id}/ask`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: currentQuestion }),
      });

      const data = await response.json();
      if (data.success) {
        setIdeaChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            question: data.data.question,
            answer: data.data.answer,
            timestamp: data.data.timestamp,
            isLoading: false,
          };
          return updated;
        });
        // Update the idea in currentPaper
        await fetchPaper(id);
        toast.success('Answer received!');
      } else {
        toast.error(data.message || 'Failed to get answer');
        setIdeaChatHistory(prev => prev.slice(0, -1));
      }
    } catch (error) {
      console.error('Error asking idea question:', error);
      toast.error('Failed to get answer');
      setIdeaChatHistory(prev => prev.slice(0, -1));
    } finally {
      setIsAsking(false);
    }
  };

  const handleDeleteIdeaChat = async (chatIndex) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/papers/ideas/${selectedIdea._id}/chats/${chatIndex}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setIdeaChatHistory(data.data);
        await fetchPaper(id);
        toast.success('Chat deleted');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const handleDeleteAllIdeaChats = async () => {
    if (!confirm('Delete all chats for this idea?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/papers/ideas/${selectedIdea._id}/chats`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setIdeaChatHistory([]);
        await fetchPaper(id);
        toast.success('All chats deleted');
      }
    } catch (error) {
      console.error('Error deleting chats:', error);
      toast.error('Failed to delete chats');
    }
  };

  const getTagColor = (level) => {
    const colors = {
      Low: 'bg-gray-500/20 text-gray-400',
      Medium: 'bg-yellow-500/20 text-yellow-400',
      High: 'bg-green-500/20 text-green-400',
    };
    return colors[level] || colors.Medium;
  };

  const getTagIcon = (type) => {
    const icons = {
      novelty: TrendingUp,
      feasibility: Target,
      aiRelevance: Zap,
    };
    return icons[type] || Lightbulb;
  };

  if (!currentPaper) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader size="lg" text="Loading..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/paper/${id}`)}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Research Ideas</h1>
                <p className="text-gray-400">
                  AI-generated research ideas based on: <span className="text-white">{currentPaper.title}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => navigate(`/paper/${id}`)}
                className="btn-secondary flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Summary</span>
              </button>
              <button 
                onClick={() => navigate(`/graph/${id}`)}
                className="btn-secondary flex items-center gap-2"
              >
                <Network className="w-4 h-4" />
                <span>Graph</span>
              </button>
              <button 
                onClick={() => navigate(`/insights/${id}`)}
                className="btn-secondary flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                <span>Insights</span>
              </button>
              <button 
                onClick={() => navigate(`/quiz/${id}`)}
                className="btn-secondary flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quiz</span>
              </button>
              <button 
                onClick={() => navigate(`/collaborate/${id}`)}
                className="btn-secondary flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>Collaborate</span>
              </button>
            </div>
          </div>

          {!currentPaper.ideas || currentPaper.ideas.length === 0 ? (
            <button
              onClick={handleGenerateIdeas}
              disabled={isGenerating}
              className="btn-primary flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating Ideas...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Research Ideas</span>
                </>
              )}
            </button>
          ) : null}
        </motion.div>

        {/* Ideas Grid */}
        {currentPaper.ideas && currentPaper.ideas.length > 0 ? (
          <>
            {/* Generate More Ideas Button */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <button
                onClick={handleGenerateMoreIdeas}
                disabled={isGeneratingMore}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingMore ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Generating More Ideas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate 3 More Ideas</span>
                  </>
                )}
              </button>
            </motion.div>

            <div className="space-y-6">
              {currentPaper.ideas.map((idea, index) => (
              <motion.div
                key={idea._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-glow"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{idea.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{idea.description}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-4">
                  {Object.entries(idea.tags).map(([key, value]) => {
                    const Icon = getTagIcon(key);
                    return (
                      <div
                        key={key}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${getTagColor(value)}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}: {value}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                  {idea.methodology && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Methodology</h4>
                      <p className="text-sm text-gray-300">{idea.methodology}</p>
                    </div>
                  )}
                  {idea.expectedOutcome && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Expected Outcome</h4>
                      <p className="text-sm text-gray-300">{idea.expectedOutcome}</p>
                    </div>
                  )}
                </div>

                {/* Resources */}
                {idea.resources && idea.resources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Required Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.resources.map((resource, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-dark-hover text-sm text-gray-300 rounded-full"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-800 space-y-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewIdeaDetail(idea);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 text-white rounded-lg transition-all font-medium"
                  >
                    <Info className="w-5 h-5" />
                    <span>Explain in Detail & Ask Questions</span>
                  </button>

                  {/* Generate/View Full Paper Button */}
                  {idea.generatedPaper ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewGeneratedPaper(idea);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all font-medium"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>View Full Research Paper</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateFullPaper(idea);
                      }}
                      disabled={isGeneratingPaper}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingPaper ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating Paper...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-5 h-5" />
                          <span>Generate Full Research Paper</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Generate/View Slides Button */}
                  {idea.generatedSlides ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewGeneratedSlides(idea);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-lg transition-all font-medium"
                    >
                      <Presentation className="w-5 h-5" />
                      <span>View PowerPoint Slides</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideOptionsIdea(idea);
                        setShowSlideOptions(true);
                      }}
                      disabled={isGeneratingSlides}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingSlides ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating Slides...</span>
                        </>
                      ) : (
                        <>
                          <Presentation className="w-5 h-5" />
                          <span>Generate PowerPoint Slides</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
            </div>
          </>
        ) : !isGenerating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-20"
          >
            <div className="w-20 h-20 bg-dark-hover rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No ideas generated yet</h3>
            <p className="text-gray-400 mb-6">
              Generate AI-powered research ideas to extend this paper's work
            </p>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Generating innovative research ideas..." />
          </div>
        )}

        {/* Idea Detail Modal */}
        <AnimatePresence>
          {selectedIdea && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedIdea(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-dark-card border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-800 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedIdea.title}</h2>
                    <p className="text-gray-400">{selectedIdea.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedIdea(null)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Full Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Methodology</h3>
                        <p className="text-gray-300">{selectedIdea.methodology}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Expected Outcome</h3>
                        <p className="text-gray-300">{selectedIdea.expectedOutcome}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(selectedIdea.tags).map(([key, value]) => (
                            <span key={key} className={`px-3 py-1 rounded-lg text-sm ${getTagColor(value)}`}>
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">Required Resources</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedIdea.resources.map((resource, i) => (
                            <span key={i} className="px-3 py-1 bg-dark-hover text-sm text-gray-300 rounded-full">
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Section */}
                  <div className="border-t border-gray-800 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-neon-purple" />
                        Ask Questions About This Idea
                      </h3>
                      {ideaChatHistory.length > 0 && (
                        <button
                          onClick={handleDeleteAllIdeaChats}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Chat History */}
                    <div className="h-64 overflow-y-auto mb-4 space-y-3 bg-dark-hover/50 rounded-lg p-4">
                      {ideaChatHistory.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-center">
                          <p className="text-sm text-gray-400">
                            Ask questions to explore this idea in detail
                          </p>
                        </div>
                      ) : (
                        ideaChatHistory.map((chat, i) => (
                          <div key={i} className="space-y-2 group relative">
                            <button
                              onClick={() => handleDeleteIdeaChat(i)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="p-2 rounded-lg bg-neon-blue/20 ml-4">
                              <p className="text-xs text-neon-blue font-semibold mb-1">You</p>
                              <p className="text-sm text-gray-300 font-medium">{chat.question}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-dark-card mr-4">
                              <p className="text-xs text-neon-purple font-semibold mb-1">AI Assistant</p>
                              {chat.isLoading ? (
                                <p className="text-sm text-gray-400">Thinking...</p>
                              ) : (
                                <p className="text-sm text-gray-200 font-medium whitespace-pre-wrap leading-relaxed">{chat.answer}</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                      {/* Invisible element to scroll to */}
                      <div ref={ideaChatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={ideaQuestion}
                        onChange={(e) => setIdeaQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAskIdeaQuestion()}
                        placeholder="Ask about methodology, feasibility, implementation..."
                        className="flex-1 px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                        disabled={isAsking}
                      />
                      <button
                        onClick={handleAskIdeaQuestion}
                        disabled={isAsking || !ideaQuestion.trim()}
                        className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Full Research Paper Viewer Modal */}
          {viewingPaper && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setViewingPaper(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-dark-card border border-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <BookOpen className="w-7 h-7 text-neon-purple" />
                      {viewingPaperIdea?.title}
                    </h2>
                    <p className="text-gray-400">Full Research Paper Proposal</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPaperChat(!showPaperChat)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat to Modify</span>
                    </button>
                    <button
                      onClick={() => {
                        setViewingPaper(null);
                        handleGenerateFullPaper(viewingPaperIdea);
                      }}
                      disabled={isGeneratingPaper}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Regenerate</span>
                    </button>
                    <button
                      onClick={handleDownloadPaper}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setViewingPaper(null)}
                      className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Paper Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Abstract */}
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-3">Abstract</h3>
                    <p className="text-gray-300 leading-relaxed">{viewingPaper.abstract}</p>
                  </div>

                  {/* Introduction */}
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-4">Introduction</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Background</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.introduction.background}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Problem Statement</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.introduction.problemStatement}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Objectives</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {viewingPaper.introduction.objectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Significance</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.introduction.significance}</p>
                      </div>
                    </div>
                  </div>

                  {/* Literature Review */}
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-4">Literature Review</h3>
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">{viewingPaper.literatureReview.summary}</p>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Research Gaps</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {viewingPaper.literatureReview.gaps.map((gap, i) => (
                            <li key={i}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Research Positioning</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.literatureReview.positioning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Methodology */}
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-4">Methodology</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Approach</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.methodology.approach}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Methods</h4>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                          {viewingPaper.methodology.methods.map((method, i) => (
                            <li key={i} className="leading-relaxed">{renderTextWithBold(method)}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Data Collection</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.methodology.dataCollection}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Analysis</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.methodology.analysis}</p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Timeline</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.methodology.timeline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Expected Results */}
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-4">Expected Results</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Outcomes</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {viewingPaper.expectedResults.outcomes.map((outcome, i) => (
                            <li key={i}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Metrics</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {viewingPaper.expectedResults.metrics.map((metric, i) => (
                            <li key={i}>{metric}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Validation</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.expectedResults.validation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-4">Conclusion</h3>
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">{viewingPaper.conclusion.summary}</p>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Contributions</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-300">
                          {viewingPaper.conclusion.contributions.map((contrib, i) => (
                            <li key={i}>{contrib}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Future Work</h4>
                        <p className="text-gray-300 leading-relaxed">{viewingPaper.conclusion.futureWork}</p>
                      </div>
                    </div>
                  </div>

                  {/* References */}
                  <div>
                    <h3 className="text-xl font-bold text-neon-blue mb-4">References</h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      {viewingPaper.references.map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                {/* Chat Interface */}
                {showPaperChat && (
                  <div className="border-t border-gray-800 p-4 bg-dark-hover">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Modify Paper</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Tell me how you want to change the paper (e.g., "Add more details to methodology", "Make abstract shorter", "Include more references")
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={paperChatInput}
                        onChange={(e) => setPaperChatInput(e.target.value)}
                        onKeyPress={async (e) => {
                          if (e.key === 'Enter' && paperChatInput.trim() && !isGeneratingPaper) {
                            setIsGeneratingPaper(true);
                            try {
                              const modifiedPaper = await modifyIdeaPaper(viewingPaperIdea._id, paperChatInput);
                              setViewingPaper(modifiedPaper);
                              setPaperChatInput('');
                              setShowPaperChat(false);
                            } catch (error) {
                              console.error('Error modifying paper:', error);
                            } finally {
                              setIsGeneratingPaper(false);
                            }
                          }
                        }}
                        placeholder="Describe your changes..."
                        className="flex-1 px-4 py-3 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <button
                        onClick={async () => {
                          if (paperChatInput.trim()) {
                            setIsGeneratingPaper(true);
                            try {
                              const modifiedPaper = await modifyIdeaPaper(viewingPaperIdea._id, paperChatInput);
                              setViewingPaper(modifiedPaper);
                              setPaperChatInput('');
                              setShowPaperChat(false);
                            } catch (error) {
                              console.error('Error modifying paper:', error);
                            } finally {
                              setIsGeneratingPaper(false);
                            }
                          }
                        }}
                        disabled={!paperChatInput.trim() || isGeneratingPaper}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isGeneratingPaper ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Modifying...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Slide Options Modal */}
          {showSlideOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSlideOptions(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-dark-card border border-gray-800 rounded-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <SettingsIcon className="w-6 h-6 text-neon-purple" />
                    Customize Presentation
                  </h3>
                  <button
                    onClick={() => setShowSlideOptions(false)}
                    className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">🎨 Theme</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Professional', 'Minimal', 'Dark', 'Futuristic'].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSlideOptions({ ...slideOptions, theme })}
                          className={`px-4 py-3 rounded-lg border-2 transition-all ${
                            slideOptions.theme === theme
                              ? 'border-neon-blue bg-neon-blue/10 text-white'
                              : 'border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Layout Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">🧱 Layout Preference</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Text-heavy', 'Visual', 'Mixed'].map((layout) => (
                        <button
                          key={layout}
                          onClick={() => setSlideOptions({ ...slideOptions, layout })}
                          className={`px-4 py-3 rounded-lg border-2 transition-all text-sm ${
                            slideOptions.layout === layout
                              ? 'border-neon-purple bg-neon-purple/10 text-white'
                              : 'border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          {layout}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slide Count */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      🕹️ Number of Slides: {slideOptions.slideCount}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      value={slideOptions.slideCount}
                      onChange={(e) => setSlideOptions({ ...slideOptions, slideCount: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5 slides</span>
                      <span>20 slides</span>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={() => handleGenerateSlides(slideOptionsIdea)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Generate Slides
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Slides Viewer Modal */}
          {viewingSlides && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setViewingSlides(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-dark-card border border-gray-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                      <Presentation className="w-7 h-7 text-orange-500" />
                      {viewingSlidesIdea?.title}
                    </h2>
                    <p className="text-gray-400">{viewingSlides.length} Slides • PowerPoint Presentation</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowSlidesChat(!showSlidesChat)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat to Modify</span>
                    </button>
                    <button
                      onClick={() => {
                        setViewingSlides(null);
                        setSlideOptionsIdea(viewingSlidesIdea);
                        setShowSlideOptions(true);
                      }}
                      disabled={isGeneratingSlides}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Regenerate</span>
                    </button>
                    <button
                      onClick={handleDownloadSlides}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => setViewingSlides(null)}
                      className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Slides Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {viewingSlides.map((slide, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-dark-hover border border-gray-700 rounded-xl p-6"
                    >
                      {/* Slide Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold">
                              Slide {slide.slideNumber}
                            </span>
                            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                              {slide.layout}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white">{slide.title}</h3>
                          {slide.subtitle && (
                            <p className="text-gray-400 mt-1">{slide.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {/* Slide Content */}
                      <div className="space-y-3">
                        {typeof slide.content === 'string' ? (
                          <p className="text-gray-300">{slide.content}</p>
                        ) : slide.content.items ? (
                          <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {slide.content.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : slide.content.mainTitle ? (
                          <div>
                            <h4 className="text-2xl font-bold text-white mb-2">{slide.content.mainTitle}</h4>
                            {slide.content.subtitle && (
                              <p className="text-lg text-gray-400">{slide.content.subtitle}</p>
                            )}
                          </div>
                        ) : (
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                            {JSON.stringify(slide.content, null, 2)}
                          </pre>
                        )}

                        {/* Visual Suggestion */}
                        {slide.visualSuggestion && (
                          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <p className="text-sm text-blue-300">
                              <strong>💡 Visual:</strong> {slide.visualSuggestion}
                            </p>
                          </div>
                        )}

                        {/* Speaker Notes */}
                        {slide.speakerNotes && (
                          <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <p className="text-sm text-purple-300">
                              <strong>🎤 Speaker Notes:</strong> {slide.speakerNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chat Interface */}
                {showSlidesChat && (
                  <div className="border-t border-gray-800 p-4 bg-dark-hover">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Modify Slides</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">
                      Tell me how you want to change the slides (e.g., "Add more visuals to slide 3", "Make slide 5 more concise", "Change theme to dark")
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={slidesChatInput}
                        onChange={(e) => setSlidesChatInput(e.target.value)}
                        onKeyPress={async (e) => {
                          if (e.key === 'Enter' && slidesChatInput.trim() && !isGeneratingSlides) {
                            setIsGeneratingSlides(true);
                            try {
                              const modifiedSlides = await modifyIdeaSlides(viewingSlidesIdea._id, slidesChatInput, slideOptions);
                              setViewingSlides(modifiedSlides);
                              setSlidesChatInput('');
                              setShowSlidesChat(false);
                            } catch (error) {
                              console.error('Error modifying slides:', error);
                            } finally {
                              setIsGeneratingSlides(false);
                            }
                          }
                        }}
                        placeholder="Describe your changes..."
                        className="flex-1 px-4 py-3 bg-dark-card border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                      <button
                        onClick={async () => {
                          if (slidesChatInput.trim()) {
                            setIsGeneratingSlides(true);
                            try {
                              const modifiedSlides = await modifyIdeaSlides(viewingSlidesIdea._id, slidesChatInput, slideOptions);
                              setViewingSlides(modifiedSlides);
                              setSlidesChatInput('');
                              setShowSlidesChat(false);
                            } catch (error) {
                              console.error('Error modifying slides:', error);
                            } finally {
                              setIsGeneratingSlides(false);
                            }
                          }
                        }}
                        disabled={!slidesChatInput.trim() || isGeneratingSlides}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isGeneratingSlides ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Modifying...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default Ideas;

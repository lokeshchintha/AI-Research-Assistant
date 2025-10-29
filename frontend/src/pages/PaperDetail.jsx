import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Sparkles,
  MessageCircle,
  Send,
  Loader as LoaderIcon,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  Network,
  Lightbulb,
  Users,
  Brain,
  HelpCircle,
  Trash2,
  X,
} from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const PaperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPaper, fetchPaper, generateSummary } = usePaperStore();
  
  const [activeSection, setActiveSection] = useState('abstract');
  const [summaryLevel, setSummaryLevel] = useState('medium');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    abstract: true,
    introduction: false,
    methods: false,
    results: false,
    conclusion: false,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchPaper(id);
    }
  }, [id, fetchPaper]);

  // Load chat history when paper is loaded
  useEffect(() => {
    if (currentPaper && currentPaper.chatHistory) {
      setChatHistory(currentPaper.chatHistory);
    }
  }, [currentPaper]);

  // Auto-scroll to bottom when new chat message appears
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    await generateSummary(id);
    setIsGenerating(false);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion('');
    setIsAsking(true);

    // Add user message with loading answer
    const tempUserMessage = { 
      question: currentQuestion, 
      answer: 'Thinking...', 
      timestamp: new Date(),
      isLoading: true 
    };
    setChatHistory(prev => [...prev, tempUserMessage]);

    try {
      const { askQuestion } = usePaperStore.getState();
      const response = await askQuestion(id, currentQuestion);
      
      if (response) {
        // Replace temp message with actual response
        setChatHistory(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            question: response.question,
            answer: response.answer,
            timestamp: response.timestamp || new Date(),
            isLoading: false
          };
          return updated;
        });
        
        // Refresh paper to get updated chat history
        await fetchPaper(id);
      }
    } catch (error) {
      toast.error('Failed to get answer');
      // Remove temp message on error
      setChatHistory(prev => prev.slice(0, -1));
    } finally {
      setIsAsking(false);
    }
  };

  const handleDeleteAllChats = async () => {
    if (!confirm('Are you sure you want to delete all chats?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/papers/${id}/chats`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setChatHistory([]);
        await fetchPaper(id);
        toast.success('All chats deleted');
      } else {
        toast.error(data.message || 'Failed to delete chats');
      }
    } catch (error) {
      console.error('Error deleting chats:', error);
      toast.error('Failed to delete chats');
    }
  };

  const handleDeleteChat = async (chatIndex) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/papers/${id}/chats/${chatIndex}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setChatHistory(data.data);
        await fetchPaper(id);
        toast.success('Chat deleted');
      } else {
        toast.error(data.message || 'Failed to delete chat');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error('Failed to delete chat');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!currentPaper) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader size="lg" text="Loading paper..." />
        </div>
      </Layout>
    );
  }

  const sections = ['abstract', 'introduction', 'methods', 'results', 'conclusion'];
  const levels = [
    { value: 'basic', label: 'Basic', color: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400' },
    { value: 'technical', label: 'Technical', color: 'text-red-400' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">{currentPaper.title}</h1>
              <p className="text-gray-400 text-sm">
                Uploaded on {new Date(currentPaper.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => navigate(`/graph/${id}`)}
                className="btn-secondary flex items-center gap-2"
              >
                <Network className="w-4 h-4" />
                <span>Graph</span>
              </button>
              <button 
                onClick={() => navigate(`/ideas/${id}`)}
                className="btn-secondary flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                <span>Ideas</span>
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

          {/* Keywords */}
          {currentPaper.keywords && currentPaper.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentPaper.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-dark-card border border-gray-700 text-sm text-gray-300 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-glow"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-neon-blue" />
                  Smart Summary
                </h2>
                {!currentPaper.summary ? (
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isGenerating}
                    className="btn-primary flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <LoaderIcon className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Summary</span>
                      </>
                    )}
                  </button>
                ) : null}
              </div>

              {currentPaper.summary ? (
                <>
                  {/* Level Selector */}
                  <div className="flex gap-2 mb-6">
                    {levels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setSummaryLevel(level.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          summaryLevel === level.value
                            ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                            : 'bg-dark-hover text-gray-400 hover:text-white'
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>

                  {/* Sections */}
                  <div className="space-y-4">
                    {sections.map((section) => {
                      const sectionData = currentPaper.summary[section];
                      if (!sectionData || !sectionData[summaryLevel]) return null;

                      return (
                        <div key={section} className="border border-gray-800 rounded-lg overflow-hidden">
                          <button
                            onClick={() => toggleSection(section)}
                            className="w-full flex items-center justify-between p-4 bg-dark-hover hover:bg-dark-card transition-colors"
                          >
                            <h3 className="text-lg font-semibold text-white capitalize">
                              {section}
                            </h3>
                            {expandedSections[section] ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          
                          <AnimatePresence>
                            {expandedSections[section] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 text-gray-300 leading-relaxed space-y-2">
                                  {sectionData[summaryLevel].split('\n').map((line, idx) => {
                                    // Function to convert **text** or text:** to bold
                                    const formatText = (text) => {
                                      // First handle **text** format
                                      let formatted = text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                          return <strong key={`bold-${i}`} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                                        }
                                        return part;
                                      });
                                      
                                      // Then handle text:** format (bold label at start)
                                      return formatted.map((part, i) => {
                                        if (typeof part === 'string' && part.includes(':**')) {
                                          const match = part.match(/^([^:]+:)\*\*/);
                                          if (match) {
                                            const boldPart = match[1];
                                            const rest = part.substring(match[0].length);
                                            return <span key={`label-${i}`}><strong className="font-bold text-white">{boldPart}</strong>{rest}</span>;
                                          }
                                        }
                                        return part;
                                      });
                                    };

                                    // Check if line is a bullet point
                                    if (line.trim().startsWith('•') || line.trim().startsWith('*') || line.trim().startsWith('-')) {
                                      // Remove ALL leading bullet symbols (•, -, *, and any duplicates)
                                      const cleanLine = line.replace(/^[•\*\-\s]+/, '');
                                      return (
                                        <div key={idx} className="flex items-start gap-3">
                                          <span className="text-neon-blue mt-1 flex-shrink-0">•</span>
                                          <span className="flex-1">{formatText(cleanLine)}</span>
                                        </div>
                                      );
                                    }
                                    // Regular line
                                    return line.trim() ? (
                                      <p key={idx} className="leading-relaxed">{formatText(line)}</p>
                                    ) : null;
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Key Findings */}
                  {currentPaper.summary.keyFindings && currentPaper.summary.keyFindings.length > 0 && (
                    <div className="mt-6 p-4 bg-dark-hover rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">Key Findings</h4>
                      <ul className="space-y-3">
                        {currentPaper.summary.keyFindings.map((finding, i) => {
                          // Function to convert **text** or text:** to bold
                          const formatText = (text) => {
                            // First handle **text** format
                            let formatted = text.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={`bold-${idx}`} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            });
                            
                            // Then handle text:** format (bold label at start)
                            return formatted.map((part, idx) => {
                              if (typeof part === 'string' && part.includes(':**')) {
                                const match = part.match(/^([^:]+:)\*\*/);
                                if (match) {
                                  const boldPart = match[1];
                                  const rest = part.substring(match[0].length);
                                  return <span key={`label-${idx}`}><strong className="font-bold text-white">{boldPart}</strong>{rest}</span>;
                                }
                              }
                              return part;
                            });
                          };

                          // Remove leading bullet if present
                          const cleanFinding = finding.replace(/^[•\*\-\s]+/, '');

                          return (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                              <span className="text-neon-blue mt-1 flex-shrink-0">•</span>
                              <span className="flex-1">{formatText(cleanFinding)}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-dark-hover rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 mb-4">
                    No summary generated yet. Click the button above to generate an AI-powered summary.
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar - AI Chat */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card-glow sticky top-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-neon-purple" />
                  Ask Anything
                </h3>
                {chatHistory.length > 0 && (
                  <button
                    onClick={handleDeleteAllChats}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Delete all chats"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Chat History */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <div className="w-12 h-12 bg-dark-hover rounded-xl flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">
                        Ask questions about this paper and get AI-powered answers
                      </p>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((chat, i) => (
                    <div key={i} className="space-y-2 group relative">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteChat(i)}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        title="Delete this chat"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      
                      {/* User Question */}
                      <div className="p-3 rounded-lg bg-neon-blue/20 ml-4">
                        <p className="text-xs text-neon-blue font-semibold mb-1">You</p>
                        <p className="text-sm text-gray-300">{chat.question}</p>
                      </div>
                      {/* AI Answer */}
                      <div className="p-4 rounded-lg bg-dark-hover mr-4">
                        <p className="text-xs text-neon-purple font-semibold mb-2">AI Assistant</p>
                        
                        {/* Show loading state */}
                        {chat.isLoading ? (
                          <div className="flex items-center gap-2">
                            <LoaderIcon className="w-4 h-4 animate-spin text-neon-blue" />
                            <p className="text-sm text-gray-400">Thinking...</p>
                          </div>
                        ) : (
                          /* Show formatted answer */
                          <div className="text-sm text-gray-300 space-y-2 formatted-answer">
                            {chat.answer.split('\n').map((line, idx) => {
                              // Function to convert **text** or text:** to bold
                              const formatText = (text) => {
                                // First handle **text** format
                                let formatted = text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={`bold-${i}`} className="font-bold text-white">{part.slice(2, -2)}</strong>;
                                  }
                                  return part;
                                });
                                
                                // Then handle text:** format (bold label at start)
                                return formatted.map((part, i) => {
                                  if (typeof part === 'string' && part.includes(':**')) {
                                    const match = part.match(/^([^:]+:)\*\*/);
                                    if (match) {
                                      const boldPart = match[1];
                                      const rest = part.substring(match[0].length);
                                      return <span key={`label-${i}`}><strong className="font-bold text-white">{boldPart}</strong>{rest}</span>;
                                    }
                                  }
                                  return part;
                                });
                              };

                              // Check if line is a bullet point
                              if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                                // Remove ALL leading bullet symbols (•, -, *, and any duplicates)
                                const cleanLine = line.replace(/^[•\-\*\s]+/, '');
                                return (
                                  <div key={idx} className="flex items-start gap-2 ml-2">
                                    <span className="text-neon-blue mt-1 flex-shrink-0">•</span>
                                    <span className="flex-1">{formatText(cleanLine)}</span>
                                  </div>
                                );
                              }
                              // Regular line
                              return line.trim() ? (
                                <p key={idx} className="leading-relaxed">{formatText(line)}</p>
                              ) : null;
                            })}
                          </div>
                        )}
                        
                        {chat.timestamp && !chat.isLoading && (
                          <p className="text-xs text-gray-500 mt-3">
                            {new Date(chat.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                {/* Invisible element to scroll to */}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask a question..."
                  className="input-field flex-1"
                  disabled={isAsking}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={isAsking || !question.trim()}
                  className="btn-primary px-4"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaperDetail;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, CheckCircle, XCircle, Trophy, RotateCcw, History, Eye, Brain, Award } from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPaper, fetchPaper } = usePaperStore();
  const [quiz, setQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [viewingAttempt, setViewingAttempt] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPaper(id);
      loadQuizAttempts();
    }
  }, [id, fetchPaper]);

  const loadQuizAttempts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/papers/${id}/quiz-attempts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setQuizAttempts(data.data);
      }
    } catch (error) {
      console.error('Error loading quiz attempts:', error);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_URL}/papers/${id}/quiz`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionCount: 5 }),
      });

      const data = await response.json();
      
      if (data.success) {
        setQuiz(data.data);
        toast.success('Quiz generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate quiz');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error(`Failed to generate quiz: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (questionIndex, optionIndex) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = async () => {
    const questions = quiz || currentPaper.quiz;
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
    
    // Save attempt to database
    try {
      const token = localStorage.getItem('token');
      const userAnswersArray = questions.map((_, i) => selectedAnswers[i] ?? -1);
      
      await fetch(`${import.meta.env.VITE_API_URL}/papers/${id}/quiz-attempts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz: questions,
          userAnswers: userAnswersArray,
          score: correctCount,
          totalQuestions: questions.length,
        }),
      });
      
      // Reload attempts
      await loadQuizAttempts();
      toast.success(`Quiz completed! Score: ${correctCount}/${questions.length}`);
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      toast.error('Failed to save quiz attempt');
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrentQuestion(0);
    setViewingAttempt(null);
  };

  const handleViewAttempt = (attempt, index) => {
    setViewingAttempt({ ...attempt, attemptNumber: index + 1 });
    setQuiz(attempt.quiz);
    const answersObj = {};
    attempt.userAnswers.forEach((answer, i) => {
      if (answer !== -1) answersObj[i] = answer;
    });
    setSelectedAnswers(answersObj);
    setScore(attempt.score);
    setShowResults(true);
    setShowHistory(false);
  };

  const handleNewQuiz = () => {
    setViewingAttempt(null);
    setShowResults(false);
    setSelectedAnswers({});
    setScore(0);
  };

  if (!currentPaper) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  const questions = quiz || currentPaper.quiz;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
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
                <h1 className="text-3xl font-bold text-white mb-2">Knowledge Quiz</h1>
                <p className="text-gray-400">
                  Test your understanding of: <span className="text-white">{currentPaper.title}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {quizAttempts.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center gap-2 px-4 py-2 bg-dark-hover hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>History ({quizAttempts.length})</span>
                </button>
              )}
              {!showResults && (
                <button
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating}
                  className="btn-primary flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span> Generate Quiz</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quiz History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-glow p-6 mb-6"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <History className="w-6 h-6 text-neon-purple" />
              Quiz History
            </h2>
            <div className="space-y-3">
              {quizAttempts.map((attempt, index) => (
                <div
                  key={index}
                  className="p-4 bg-dark-hover rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-semibold">Attempt #{quizAttempts.length - index}</span>
                        <span className={`text-sm px-2 py-1 rounded ${
                          (attempt.score / attempt.totalQuestions) >= 0.8 ? 'bg-green-500/20 text-green-400' :
                          (attempt.score / attempt.totalQuestions) >= 0.6 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {attempt.score}/{attempt.totalQuestions} ({Math.round((attempt.score / attempt.totalQuestions) * 100)}%)
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(attempt.completedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleViewAttempt(attempt, quizAttempts.length - index - 1)}
                      className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Review</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quiz Content */}
        {questions && questions.length > 0 && !showHistory && (
          <div className="space-y-6">
            {/* Progress Bar */}
            {!showResults && (
              <div className="card-glow p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-gray-400">
                    {Object.keys(selectedAnswers).length} answered
                  </span>
                </div>
                <div className="w-full bg-dark-hover rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Results Summary */}
            {showResults && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-glow p-8 text-center"
              >
                {viewingAttempt && (
                  <div className="mb-4 px-4 py-2 bg-neon-purple/20 text-neon-purple rounded-lg inline-block">
                    <span className="text-sm font-semibold">Viewing Attempt #{viewingAttempt.attemptNumber}</span>
                    <span className="text-xs ml-2">({new Date(viewingAttempt.completedAt).toLocaleString()})</span>
                  </div>
                )}
                <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-2">
                  {viewingAttempt ? 'Previous Attempt' : 'Quiz Completed!'}
                </h2>
                <p className="text-5xl font-bold text-neon-blue mb-4">
                  {score}/{questions.length}
                </p>
                <p className="text-gray-400 mb-6">
                  {score === questions.length ? 'Perfect score! 🎉' :
                   score >= questions.length * 0.7 ? 'Great job! 👏' :
                   score >= questions.length * 0.5 ? 'Good effort! 💪' :
                   'Keep studying! 📚'}
                </p>
                <div className="flex items-center justify-center gap-3">
                  {viewingAttempt ? (
                    <button
                      onClick={handleNewQuiz}
                      className="btn-primary"
                    >
                      Take New Quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleResetQuiz}
                      className="btn-primary"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* Questions */}
            <AnimatePresence mode="wait">
              {questions.map((question, qIndex) => (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="card-glow p-6"
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-neon-blue">
                          Question {qIndex + 1}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(question.difficulty)}`}>
                          {question.difficulty}
                        </span>
                        {question.topic && (
                          <span className="text-xs px-2 py-1 bg-dark-hover text-gray-400 rounded-full">
                            {question.topic}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {question.question}
                      </h3>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3 mb-4">
                    {question.options.map((option, oIndex) => {
                      const isSelected = selectedAnswers[qIndex] === oIndex;
                      const isCorrect = question.correctAnswer === oIndex;
                      const showAnswer = showResults;

                      return (
                        <button
                          key={oIndex}
                          onClick={() => handleSelectAnswer(qIndex, oIndex)}
                          disabled={showResults}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                            showAnswer && isCorrect
                              ? 'border-green-400 bg-green-400/10'
                              : showAnswer && isSelected && !isCorrect
                              ? 'border-red-400 bg-red-400/10'
                              : isSelected
                              ? 'border-neon-blue bg-neon-blue/10'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              showAnswer && isCorrect
                                ? 'border-green-400 bg-green-400'
                                : showAnswer && isSelected && !isCorrect
                                ? 'border-red-400 bg-red-400'
                                : isSelected
                                ? 'border-neon-blue bg-neon-blue'
                                : 'border-gray-600'
                            }`}>
                              {showAnswer && isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                              {showAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white" />}
                              {!showAnswer && isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className={`flex-1 ${
                              showAnswer && (isCorrect || (isSelected && !isCorrect))
                                ? 'text-white font-medium'
                                : 'text-gray-300'
                            }`}>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showResults && question.explanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 bg-dark-hover rounded-lg border border-gray-700"
                    >
                      <p className="text-sm font-semibold text-neon-blue mb-2">Explanation:</p>
                      <p className="text-sm text-gray-300">{question.explanation}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Submit Button */}
            {!showResults && Object.keys(selectedAnswers).length === questions.length && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSubmitQuiz}
                className="w-full btn-primary py-4 text-lg"
              >
                Submit Quiz
              </motion.button>
            )}
          </div>
        )}

        {/* Empty State */}
        {!questions && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No quiz available yet</p>
            <p className="text-sm text-gray-500">Click "Generate Quiz" to create questions from this paper</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Quiz;

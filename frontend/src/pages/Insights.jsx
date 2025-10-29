import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertCircle, CheckCircle, ArrowLeft, Sparkles } from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Insights = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPaper, fetchPaper } = usePaperStore();
  const [insights, setInsights] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPaper(id);
    }
  }, [id, fetchPaper]);

  // Load insights from paper if they exist
  useEffect(() => {
    if (currentPaper && currentPaper.insights) {
      setInsights(currentPaper.insights);
    }
  }, [currentPaper]);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const apiUrl = `${import.meta.env.VITE_API_URL}/papers/${id}/insights`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setInsights(data.data);
        toast.success('Insights generated successfully!');
      } else {
        toast.error(data.message || 'Failed to generate insights');
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error(`Failed to generate insights: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentPaper) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreWidth = (score) => `${(score / 10) * 100}%`;

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
                <h1 className="text-3xl font-bold text-white mb-2">AI Insights Analysis</h1>
                <p className="text-gray-400">
                  Comprehensive evaluation of: <span className="text-white">{currentPaper.title}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleGenerateInsights}
              disabled={isGenerating}
              className="btn-primary flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Insights</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Display Insights */}
        {(insights || currentPaper.insights) && (
          <div className="space-y-6">
            {/* Overall Score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-glow p-6 text-center"
            >
              <h2 className="text-xl font-semibold text-gray-300 mb-2">Overall Score</h2>
              <div className={`text-6xl font-bold ${getScoreColor((insights || currentPaper.insights).overallScore)}`}>
                {(insights || currentPaper.insights).overallScore}/10
              </div>
              <p className="text-gray-400 mt-4">{(insights || currentPaper.insights).recommendation}</p>
            </motion.div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Novelty */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card-glow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-neon-blue" />
                  <h3 className="text-xl font-semibold text-white">Novelty</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor((insights || currentPaper.insights).novelty.score)}`}>
                      {(insights || currentPaper.insights).novelty.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-dark-hover rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all"
                      style={{ width: getScoreWidth((insights || currentPaper.insights).novelty.score) }}
                    />
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{(insights || currentPaper.insights).novelty.description}</p>
                <ul className="space-y-2">
                  {(insights || currentPaper.insights).novelty.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Method Strength */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="card-glow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-semibold text-white">Method Strength</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor((insights || currentPaper.insights).methodStrength.score)}`}>
                      {(insights || currentPaper.insights).methodStrength.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-dark-hover rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: getScoreWidth((insights || currentPaper.insights).methodStrength.score) }}
                    />
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{(insights || currentPaper.insights).methodStrength.description}</p>
                <ul className="space-y-2">
                  {(insights || currentPaper.insights).methodStrength.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Practical Relevance */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="card-glow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Practical Relevance</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Score</span>
                    <span className={`text-2xl font-bold ${getScoreColor((insights || currentPaper.insights).practicalRelevance.score)}`}>
                      {(insights || currentPaper.insights).practicalRelevance.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-dark-hover rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all"
                      style={{ width: getScoreWidth((insights || currentPaper.insights).practicalRelevance.score) }}
                    />
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{(insights || currentPaper.insights).practicalRelevance.description}</p>
                <ul className="space-y-2">
                  {(insights || currentPaper.insights).practicalRelevance.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Limitations */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card-glow p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-semibold text-white">Limitations</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Impact</span>
                    <span className={`text-2xl font-bold ${getScoreColor((insights || currentPaper.insights).limitations.score)}`}>
                      {(insights || currentPaper.insights).limitations.score}/10
                    </span>
                  </div>
                  <div className="w-full bg-dark-hover rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-red-400 to-orange-500 h-2 rounded-full transition-all"
                      style={{ width: getScoreWidth((insights || currentPaper.insights).limitations.score) }}
                    />
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{(insights || currentPaper.insights).limitations.description}</p>
                <ul className="space-y-2">
                  {(insights || currentPaper.insights).limitations.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!insights && !currentPaper.insights && !isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No insights generated yet</p>
            <p className="text-sm text-gray-500">Click "Generate Insights" to analyze this paper</p>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Insights;

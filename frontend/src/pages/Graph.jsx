import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Network, Sparkles, ArrowLeft, Lightbulb, Users, FileText, Brain, HelpCircle } from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import KnowledgeGraph from '../components/KnowledgeGraph';

const Graph = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPaper, fetchPaper, generateKnowledgeGraph } = usePaperStore();
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPaper(id);
    }
  }, [id, fetchPaper]);

  const handleGenerateGraph = async () => {
    setIsGenerating(true);
    await generateKnowledgeGraph(id);
    setIsGenerating(false);
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

  const hasGraph = currentPaper.knowledgeGraph && 
                   currentPaper.knowledgeGraph.nodes && 
                   currentPaper.knowledgeGraph.nodes.length > 0;

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/paper/${id}`)}
                className="p-2 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Knowledge Graph</h1>
                <p className="text-gray-400">
                  Interactive visualization of concepts from: <span className="text-white">{currentPaper.title}</span>
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
              {!hasGraph && (
                <button
                  onClick={handleGenerateGraph}
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
                      <span>Generate Graph</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Graph Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 card-glow overflow-hidden"
        >
          {hasGraph ? (
            <KnowledgeGraph data={currentPaper.knowledgeGraph} />
          ) : !isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-dark-hover rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Network className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No graph generated yet</h3>
                <p className="text-gray-400 mb-6">
                  Generate an interactive knowledge graph to visualize key concepts
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader size="lg" text="Generating knowledge graph..." />
            </div>
          )}
        </motion.div>

        {/* Instructions */}
        {hasGraph && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 card"
          >
            <h3 className="text-sm font-semibold text-white mb-3">How to use:</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-neon-blue mt-0.5">•</span>
                <span>Click and drag nodes to rearrange the graph</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-blue mt-0.5">•</span>
                <span>Click on any node to view detailed information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-blue mt-0.5">•</span>
                <span>Use mouse wheel or pinch to zoom in/out</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neon-blue mt-0.5">•</span>
                <span>Different colors represent different concept categories</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Graph;

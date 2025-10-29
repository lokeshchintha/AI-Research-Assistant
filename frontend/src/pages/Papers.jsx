import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Calendar, Trash2, Eye, Plus, Users } from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import useAuthStore from '../store/useAuthStore';
import Layout from '../components/Layout';
import Loader from '../components/Loader';

const Papers = () => {
  const { papers, fetchPapers, deletePaper, isLoading } = usePaperStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this paper?')) {
      await deletePaper(id);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Papers</h1>
            <p className="text-gray-400">Manage and analyze your research papers</p>
          </div>
          <Link to="/upload" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Upload Paper</span>
          </Link>
        </div>

        {/* Papers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader size="lg" text="Loading papers..." />
          </div>
        ) : papers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-20"
          >
            <div className="w-20 h-20 bg-dark-hover rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No papers yet</h3>
            <p className="text-gray-400 mb-6">Upload your first research paper to get started</p>
            <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Upload Paper</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper, index) => (
              <motion.div
                key={paper._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/paper/${paper._id}`}
                  className="card-glow block h-full hover:scale-105 transition-transform duration-300"
                >
                  {/* Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    {/* Ownership Badge */}
                    {paper.owner?._id !== user?._id && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded-full">
                        <Users className="w-3 h-3" />
                        Shared
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {paper.title}
                  </h3>
                  
                  {/* Owner info for shared papers */}
                  {paper.owner?._id !== user?._id && paper.owner?.name && (
                    <p className="text-xs text-gray-400 mb-2">
                      by {paper.owner.name}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Keywords */}
                  {paper.keywords && paper.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {paper.keywords.slice(0, 3).map((keyword, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-dark-hover text-xs text-gray-300 rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                      {paper.keywords.length > 3 && (
                        <span className="px-2 py-1 bg-dark-hover text-xs text-gray-400 rounded-full">
                          +{paper.keywords.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.summary && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Summarized
                      </span>
                    )}
                    {paper.ideas && paper.ideas.length > 0 && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        {paper.ideas.length} Ideas
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-dark-hover hover:bg-neon-blue/20 text-gray-300 hover:text-neon-blue rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">View</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(paper._id, e)}
                      className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Papers;

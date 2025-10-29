import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, UserPlus, Send, Loader as LoaderIcon, ArrowLeft, Network, Lightbulb, FileText, Brain, HelpCircle } from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import useAuthStore from '../store/useAuthStore';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { getSocket, connectSocket, disconnectSocket } from '../lib/socket';
import toast from 'react-hot-toast';

const Collaborate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentPaper, fetchPaper, addCollaborator, addNote } = usePaperStore();
  const { user } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [activeUsers, setActiveUsers] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    if (id) {
      fetchPaper(id);
      
      // Connect to socket
      connectSocket();
      const socket = getSocket();
      
      // Join paper room
      socket.emit('join-paper', id);
      
      // Listen for events
      socket.on('user-joined', ({ userCount }) => {
        setActiveUsers(userCount);
        toast.success('A collaborator joined');
      });
      
      socket.on('user-left', ({ userCount }) => {
        setActiveUsers(userCount);
      });
      
      socket.on('receive-note', (note) => {
        // Refresh paper to get new note
        fetchPaper(id);
      });
      
      socket.on('user-typing', ({ userName }) => {
        setIsTyping(true);
        setTypingUser(userName);
      });
      
      socket.on('user-stop-typing', () => {
        setIsTyping(false);
        setTypingUser('');
      });
      
      return () => {
        socket.emit('leave-paper', id);
        socket.off('user-joined');
        socket.off('user-left');
        socket.off('receive-note');
        socket.off('user-typing');
        socket.off('user-stop-typing');
        disconnectSocket();
      };
    }
  }, [id, fetchPaper]);

  const handleAddCollaborator = async () => {
    if (!email.trim()) return;
    
    setIsAdding(true);
    const success = await addCollaborator(id, email);
    if (success) {
      setEmail('');
    }
    setIsAdding(false);
  };

  const handleSendNote = async () => {
    if (!noteContent.trim()) return;
    
    const success = await addNote(id, noteContent);
    if (success) {
      // Emit socket event
      const socket = getSocket();
      socket.emit('send-note', {
        paperId: id,
        note: {
          user: user,
          content: noteContent,
          timestamp: new Date(),
        },
      });
      
      setNoteContent('');
      socket.emit('stop-typing', { paperId: id });
    }
  };

  const handleTyping = () => {
    const socket = getSocket();
    socket.emit('typing', { paperId: id, userName: user?.name });
    
    // Clear typing after 2 seconds
    setTimeout(() => {
      socket.emit('stop-typing', { paperId: id });
    }, 2000);
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
                <h1 className="text-3xl font-bold text-white mb-2">Collaborate</h1>
                <p className="text-gray-400">
                  Working on: <span className="text-white">{currentPaper.title}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
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
              <div className="flex items-center gap-2 px-4 py-2 bg-dark-card border border-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">{activeUsers} active</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Collaborators */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card-glow">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-neon-blue" />
                Collaborators
              </h2>

              {/* Add Collaborator */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Add by Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCollaborator()}
                    placeholder="colleague@example.com"
                    className="input-field flex-1"
                    disabled={isAdding}
                  />
                  <button
                    onClick={handleAddCollaborator}
                    disabled={isAdding || !email.trim()}
                    className="btn-primary px-4"
                  >
                    {isAdding ? (
                      <LoaderIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Owner */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-dark-hover rounded-lg">
                  <img
                    src={currentPaper.owner?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner'}
                    alt={currentPaper.owner?.name}
                    className="w-10 h-10 rounded-full border-2 border-neon-blue"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{currentPaper.owner?.name}</p>
                    <p className="text-xs text-gray-400">Owner</p>
                  </div>
                </div>

                {/* Collaborators List */}
                {currentPaper.collaborators && currentPaper.collaborators.length > 0 && (
                  <>
                    {currentPaper.collaborators.map((collab) => (
                      <div key={collab._id} className="flex items-center gap-3 p-3 bg-dark-hover rounded-lg">
                        <img
                          src={collab.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=collab'}
                          alt={collab.user?.name}
                          className="w-10 h-10 rounded-full border-2 border-gray-700"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{collab.user?.name}</p>
                          <p className="text-xs text-gray-400">Collaborator</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card-glow h-full flex flex-col">
              <h2 className="text-xl font-bold text-white mb-4">Shared Notes</h2>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-96">
                {currentPaper.notes && currentPaper.notes.length > 0 ? (
                  currentPaper.notes.map((note, i) => (
                    <div key={i} className="p-4 bg-dark-hover rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={note.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                          alt={note.user?.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium text-white">{note.user?.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(note.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <div className="w-12 h-12 bg-dark-hover rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-400">
                        No notes yet. Start collaborating by adding a note!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Typing Indicator */}
              {isTyping && typingUser && (
                <div className="text-xs text-gray-400 mb-2">
                  {typingUser} is typing...
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteContent}
                  onChange={(e) => {
                    setNoteContent(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendNote()}
                  placeholder="Add a note..."
                  className="input-field flex-1"
                />
                <button
                  onClick={handleSendNote}
                  disabled={!noteContent.trim()}
                  className="btn-primary px-4"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Collaborate;

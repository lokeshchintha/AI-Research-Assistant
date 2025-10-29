import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Sparkles, FileText, Lightbulb, Network, BookOpen, ArrowRight, Zap, Target, TrendingUp, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../assets/logo.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Paper Analysis",
      description: "Upload research papers and get instant AI-powered summaries and insights"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Research Ideas",
      description: "Generate innovative research ideas based on existing papers"
    },
    {
      icon: <Network className="w-8 h-8" />,
      title: "Knowledge Graphs",
      description: "Visualize complex relationships and concepts in your research"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Full Paper Generation",
      description: "Transform ideas into complete research paper proposals"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Chat Assistant",
      description: "Ask questions and get detailed explanations about your research"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "PowerPoint Slides",
      description: "Generate professional presentation slides from your research"
    }
  ];

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0a0a0f] dark:via-[#13131a] dark:to-[#0a0a0f] text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Theme Toggle Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={toggleTheme}
          className="p-3 bg-gray-200 dark:bg-white/10 backdrop-blur-sm hover:bg-gray-300 dark:hover:bg-white/20 rounded-full transition-all border border-gray-300 dark:border-white/20 shadow-lg"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-blue-600" />
          )}
        </button>
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50 dark:opacity-100">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Logo/Title */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <img 
                src={logo} 
                alt="Research Partner Logo" 
                className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover shadow-lg"
              />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Research Partner
              </h1>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-6"
            >
              Your AI-Powered Research Assistant
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto"
            >
              Transform your research workflow with cutting-edge AI. Analyze papers, generate ideas, 
              create visualizations, and write complete research proposals - all in one intelligent platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple hover:from-neon-blue/80 hover:to-neon-purple/80 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-neon-blue/50"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/80 hover:to-neon-pink/80 text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-neon-purple/50"
              >
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Everything you need for advanced research analysis</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="bg-white dark:bg-white/5 backdrop-blur-sm border-2 border-gray-400 dark:border-white/10 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-neon-blue transition-all group shadow-lg dark:shadow-none"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-neon-blue">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 backdrop-blur-sm border-2 border-gray-400 dark:border-white/10 rounded-3xl p-12 max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-8 h-8 text-neon-blue" />
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">10x</div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Faster Research</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-8 h-8 text-neon-purple" />
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">AI-Powered</div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Smart Analysis</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-8 h-8 text-neon-pink" />
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">100%</div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">Productivity Boost</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <div className="container mx-auto px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">Ready to Transform Your Research?</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">Join researchers worldwide using AI to accelerate their work</p>
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-5 bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/80 hover:to-neon-pink/80 text-white font-bold text-lg rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-neon-purple/50"
            >
              Start Your Journey
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

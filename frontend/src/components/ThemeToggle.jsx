import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    toggleTheme();
    
    // Force a check after toggle
    setTimeout(() => {
      const htmlClass = document.documentElement.className;
    }, 100);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="p-3 rounded-lg bg-white dark:bg-[#13131a]
                 border border-gray-300 dark:border-gray-700
                 hover:border-neon-blue transition-all duration-300
                 text-gray-600 dark:text-gray-400
                 hover:text-neon-blue"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;

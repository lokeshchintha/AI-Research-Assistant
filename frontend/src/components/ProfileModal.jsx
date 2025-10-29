import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Image } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const avatarStyles = [
  'avataaars',
  'bottts',
  'personas',
  'lorelei',
  'notionists',
  'adventurer',
  'big-smile',
  'micah',
  'initials'
];

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [seed, setSeed] = useState(user?.email || 'default');
  const [name, setName] = useState(user?.name || '');

  const generateAvatar = (style, seedValue) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seedValue}`;
  };

  const handleSave = () => {
    const newAvatar = generateAvatar(selectedStyle, seed);
    const updates = {
      avatar: newAvatar
    };
    
    // Only update name if it's different
    if (name && name !== user?.name) {
      updates.name = name;
    }
    
    updateUser(updates);
    toast.success('Profile updated successfully!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-[#13131a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a24] rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Edit Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-neon-blue"
            />
          </div>

          {/* Email (Read-only) */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-[#1a1a24] rounded-lg">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</span>
            </div>
          </div>

          {/* Current Avatar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Current Avatar
            </h3>
            <div className="flex justify-center">
              <img
                src={user?.avatar || generateAvatar('avataaars', 'default')}
                alt="Current avatar"
                className="w-32 h-32 rounded-full border-4 border-neon-blue"
              />
            </div>
          </div>

          {/* Avatar Style Selector */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Choose Avatar Style</h3>
            <div className="grid grid-cols-3 gap-3">
              {avatarStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedStyle === style
                      ? 'border-neon-blue bg-neon-blue/10'
                      : 'border-gray-300 dark:border-gray-700 hover:border-neon-blue/50'
                  }`}
                >
                  <img
                    src={generateAvatar(style, seed)}
                    alt={style}
                    className="w-full h-16 rounded"
                  />
                  <p className="text-xs text-center mt-1 text-gray-900 dark:text-white capitalize">
                    {style}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Preview</h3>
            <div className="flex justify-center">
              <img
                src={generateAvatar(selectedStyle, seed)}
                alt="Preview"
                className="w-32 h-32 rounded-full border-4 border-neon-purple"
              />
            </div>
          </div>

          {/* Seed Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Customize (Optional)
            </label>
            <input
              type="text"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="Enter any text to randomize"
              className="w-full px-4 py-2 bg-white dark:bg-[#1a1a24] border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-neon-blue"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Change this text to get a different variation
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a24] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg hover:shadow-neon-blue transition-all"
            >
              Save Changes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;

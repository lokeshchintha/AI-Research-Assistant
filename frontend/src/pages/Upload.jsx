import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import usePaperStore from '../store/usePaperStore';
import Layout from '../components/Layout';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const { uploadPaper, isUploading } = usePaperStore();
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setTitle(selectedFile.name.replace('.pdf', ''));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    const paper = await uploadPaper(file, title);
    if (paper) {
      navigate(`/paper/${paper._id}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Upload Research Paper</h1>
            <p className="text-gray-400">
              Upload a PDF to analyze, summarize, and generate insights with AI
            </p>
          </div>

          {/* Upload Area */}
          <div className="card-glow mb-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-neon-blue bg-neon-blue/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <input {...getInputProps()} />
              
              {file ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white mb-1">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm">File ready to upload</span>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-dark-hover rounded-2xl flex items-center justify-center">
                    <UploadIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      {isDragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                    </p>
                    <p className="text-sm text-gray-400">or click to browse files</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Maximum file size: 10MB</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title Input */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-6"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Paper Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Enter a custom title for your paper"
              />
              <p className="text-xs text-gray-400 mt-2">
                Leave empty to use the filename as the title
              </p>
            </motion.div>
          )}

          {/* Actions */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4"
            >
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Uploading & Processing...</span>
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-5 h-5" />
                    <span>Upload & Analyze</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setFile(null);
                  setTitle('');
                }}
                disabled={isUploading}
                className="btn-secondary"
              >
                Cancel
              </button>
            </motion.div>
          )}

          {/* Features Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Extraction</h3>
              <p className="text-sm text-gray-400">
                Automatically extract and organize content from your research paper
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center mb-4">
                <UploadIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-400">
                Generate summaries, insights, and research ideas using Gemini AI
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-neon-blue rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure Storage</h3>
              <p className="text-sm text-gray-400">
                Your papers are securely stored and accessible anytime
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Upload;

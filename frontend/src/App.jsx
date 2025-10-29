import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Papers from './pages/Papers';
import PaperDetail from './pages/PaperDetail';
import Ideas from './pages/Ideas';
import Graph from './pages/Graph';
import Collaborate from './pages/Collaborate';
import Insights from './pages/Insights';
import Quiz from './pages/Quiz';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#13131a',
              color: '#fff',
              border: '1px solid #374151',
            },
          success: {
            iconTheme: {
              primary: '#00d4ff',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff006e',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/papers"
          element={
            <ProtectedRoute>
              <Papers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paper/:id"
          element={
            <ProtectedRoute>
              <PaperDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ideas/:id"
          element={
            <ProtectedRoute>
              <Ideas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/graph/:id"
          element={
            <ProtectedRoute>
              <Graph />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collaborate/:id"
          element={
            <ProtectedRoute>
              <Collaborate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/insights/:id"
          element={
            <ProtectedRoute>
              <Insights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          }
        />
        
        {/* Default Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;

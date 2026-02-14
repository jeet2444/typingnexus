import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Website Components
import Home from './components/Home';
import Exams from './components/Exams';
import Pricing from './components/Pricing';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ExamDetail from './components/ExamDetail';
import TypingTest from './components/TypingTest';
import UserProfile from './components/UserProfile';
import PracticeLibrary from './components/PracticeLibrary';
import TypingPractice from './components/TypingPractice';
import ExcelTest from './components/ExcelTest';
import WordFormattingTest from './components/WordFormattingTest';
import TypingTutorial from './components/TypingTutorial';
import CPTMenu from './components/CPTMenu';
import ExamInstructions from './components/ExamInstructions';
import Blog from './components/Blog';
import KeyboardPractice from './components/KeyboardPractice';
import PracticeExams from './components/PracticeExams';
import GlobalAdLayout from './components/GlobalAdLayout';
import TypingExamSetup from './components/TypingExamSetup';



// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAdmin, loading } = useAuth();

  // Show a simple loader while auth is initializing to prevent blank screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        <div className="animate-pulse">Initializing Typing Nexus...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-200">
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
        <Routes>


          {/* Regular Website Content within Global Layout (Ads, Navbar, BG) */}
          <Route element={<GlobalAdLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/start-typing" element={<ProtectedRoute><TypingExamSetup /></ProtectedRoute>} />
            <Route path="/instructions" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />
            <Route path="/learn" element={<TypingTutorial />} />
            <Route path="/learn/:lang" element={<TypingTutorial />} />
            <Route path="/learn/:lang/:lessonId" element={<TypingTutorial />} />
            <Route path="/keyboard" element={<KeyboardPractice />} />
            <Route path="/keyboard/:lang" element={<KeyboardPractice />} />
            <Route path="/practice-exams" element={<PracticeExams />} />
            <Route path="/typing-test" element={<TypingTest />} />
            <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/exam/:id" element={<ProtectedRoute><ExamDetail /></ProtectedRoute>} />
            <Route path="/test/:id" element={<TypingTest />} />
            <Route path="/cpt/:type" element={<CPTMenu />} />
            <Route path="/test/:type/:id/instructions" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />
            <Route path="/test/excel/:id" element={<ProtectedRoute><ExcelTest /></ProtectedRoute>} />
            <Route path="/test/word/:id" element={<ProtectedRoute><WordFormattingTest /></ProtectedRoute>} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/practice" element={<PracticeLibrary />} />
            <Route path="/practice/:lang" element={<PracticeLibrary />} />
            <Route path="/practice/:lang/set/:id" element={<TypingPractice />} />
            <Route path="/practice/:lang/drill/:drillId" element={<KeyboardPractice />} />
            <Route path="/blog" element={<Blog />} />

            {/* Catch-all Website Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
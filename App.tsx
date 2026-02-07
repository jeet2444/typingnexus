import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
// import AdminPanel from './components/AdminPanel'; // Removed for Lazy Loading
// import AdminLogin from './components/AdminLogin'; // Removed for Lazy Loading
import TypingTutorial from './components/TypingTutorial';
import CPTMenu from './components/CPTMenu';
import ExamInstructions from './components/ExamInstructions';
import Blog from './components/Blog';
import KeyboardPractice from './components/KeyboardPractice';
import PracticeExams from './components/PracticeExams';
import GlobalAdLayout from './components/GlobalAdLayout';
import TypingExamSetup from './components/TypingExamSetup';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean }> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Lazy Load Admin Components for Security & Performance
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const AdminLogin = React.lazy(() => import('./components/AdminLogin'));

const AppContent: React.FC = () => {
  const { isAdmin } = useAuth();
  // BUILD_TARGET can be 'admin', 'website', or 'universal' (default)
  // We will force this to be specific builds to solve the user's issue.
  const buildTarget = import.meta.env.VITE_BUILD_TARGET || 'universal';
  console.log("Current Build Target:", buildTarget);

  const hostname = window.location.hostname.toLowerCase();

  // 1. ADMIN BUILD or Subdomain Check
  const isAdminSubdomain = hostname === 'admin.typingnexus.in' || hostname.startsWith('admin.');
  const shouldRenderAdmin = buildTarget === 'admin' || (buildTarget === 'universal' && isAdminSubdomain);

  if (shouldRenderAdmin) {
    // Dynamic Title for Admin
    React.useEffect(() => {
      document.title = "Typing Nexus - Secure Admin";
    }, []);

    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-200 bg-gray-950">
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Admin Portal...</div>}>
          <Routes>
            <Route path="/*" element={isAdmin ? <AdminPanel /> : <AdminLogin />} />
            {/* Catch-all: If they go to /anything-else on admin domain, send them to login/panel */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </div>
    );
  }

  // 2. WEBSITE BUILD (Force Main Site)
  // If we are in 'website' mode, we NEVER show admin, even if URL says admin.
  if (buildTarget === 'website') {
    // Fall through to main site render
  } else if (isAdminSubdomain && buildTarget === 'universal') {
    // Already handled above
  }

  // Handle Legacy Test Domain (Redirect to Production)
  if (hostname === 'test.typingnexus.in') {
    window.location.replace('https://typingnexus.in' + window.location.pathname + window.location.search);
    return <div className="p-10 text-center font-bold">Redirecting to production...</div>;
  }

  // --- NEW: Sync Global Settings from Hostinger ---
  React.useEffect(() => {
    // This fetches the latest settings from local JSON file
    import('./utils/adminStore').then(({ syncSettingsFromHost }) => {
      syncSettingsFromHost();
    });
  }, []);

  // 3. Main Website
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-200">
      <Routes>
        {/* GLOBAL LAYOUT ROUTES (With Ads) */}
        <Route element={<GlobalAdLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/start-typing" element={<ProtectedRoute><TypingExamSetup /></ProtectedRoute>} />
          <Route path="/instructions" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />

          {/* Learning Routes */}
          <Route path="/learn" element={<TypingTutorial />} />
          <Route path="/learn/:lessonId" element={<TypingTutorial />} />
          <Route path="/keyboard" element={<KeyboardPractice />} />

          {/* Practice Exams & Tests */}
          <Route path="/practice-exams" element={<PracticeExams />} />
          <Route path="/typing-test" element={<TypingTest />} />

          <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
          <Route path="/exam/:id" element={<ProtectedRoute><ExamDetail /></ProtectedRoute>} />
          <Route path="/test/:id" element={<TypingTest />} />

          {/* CPT Routes */}
          <Route path="/cpt/:type" element={<CPTMenu />} />
          <Route path="/test/:type/:id/instructions" element={<ProtectedRoute><ExamInstructions /></ProtectedRoute>} />
          <Route path="/test/excel/:id" element={<ProtectedRoute><ExcelTest /></ProtectedRoute>} />
          <Route path="/test/word/:id" element={<ProtectedRoute><WordFormattingTest /></ProtectedRoute>} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected: Profile */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />

          <Route path="/practice" element={<PracticeLibrary />} />
          <Route path="/practice/:lang/:id" element={<TypingPractice />} />
          <Route path="/blog" element={<Blog />} />
        </Route>
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  // Determine if we are on the admin subdomain
  const isAdminDomain = window.location.hostname.startsWith('admin');
  // If on admin subdomain, basename is '/'. If on main domain with /admin path, basename is '/admin'
  // But since we are building with relative base './', we let the browser handle it mostly.
  // However, React Router needs to know if it's running in a subdirectory.
  // For admin.typingnexus.in, pathname starts with /, so basename '/'.
  // For typingnexus.in/admin, pathname starts with /admin, so basename '/admin'.

  const basename = window.location.pathname.startsWith('/admin') ? '/admin' : '/';

  return (
    <AuthProvider>
      <Router basename={basename}>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
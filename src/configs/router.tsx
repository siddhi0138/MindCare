// src/configs/router.ts
import { Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// --- Import Pages ---
// Core Pages
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import NotFound from '@/pages/NotFound';
import PrivacyPage from '@/pages/PrivacyPage';

// Protected Pages
import JournalPage from '@/pages/JournalPage';
import MoodJournalPage from '@/pages/MoodJournalPage';
import MeditationPage from '@/pages/MeditationPage';
import ChatPage from '@/pages/ChatPage';
import ResourcesPage from '@/pages/ResourcesPage';
import CommunityPage from '@/pages/CommunityPage';
import AssessmentPage from '@/pages/AssessmentPage';
import TherapistPage from '@/pages/TherapistPage';
import CopingToolsPage from '@/pages/CopingToolsPage';
import InteractiveToolsPage from '@/pages/InteractiveToolsPage';
import ProfilePage from '@/pages/ProfilePage';
import ExercisesPage from '@/pages/ExercisesPage';

// --- Protected Route Component ---
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Add a loading spinner or skeleton screen here
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended location
    return <Navigate to="/login" replace />;
  }

  return children;
};

// --- App Router Component ---
const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Protected routes */}
      <Route path="/journal" element={<ProtectedRoute><JournalPage /></ProtectedRoute>} />
      <Route path="/mood-journal" element={<ProtectedRoute><MoodJournalPage /></ProtectedRoute>} />
      <Route path="/meditation" element={<ProtectedRoute><MeditationPage /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
      <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
      <Route path="/therapists" element={<ProtectedRoute><TherapistPage /></ProtectedRoute>} />
      <Route path="/coping-tools" element={<ProtectedRoute><CopingToolsPage /></ProtectedRoute>} />
      <Route path="/interactive-tools" element={<ProtectedRoute><InteractiveToolsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><ExercisesPage /></ProtectedRoute>} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;

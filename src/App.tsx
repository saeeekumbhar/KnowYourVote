/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SystemMindMap from './pages/SystemMindMap';
import { ElectionPhaseProvider } from './context/ElectionPhaseContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DevControlPanel } from './components/DevControlPanel';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';

import LoginPage from './pages/LoginPage';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5A5A40] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9F8F6] flex flex-col font-sans text-[#33332D]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/constituency/:constituency_id" element={<Dashboard />} />
            <Route path="/system" element={<SystemMindMap />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <ElectionPhaseProvider>
          <DevControlPanel />
          <AppContent />
        </ElectionPhaseProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
}

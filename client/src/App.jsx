import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AIUsage from './pages/AIUsage';
import TokenAttribution from './pages/TokenAttribution';
import Infrastructure from './pages/Infrastructure';
import VectorStorage from './pages/VectorStorage';
import ShadowAI from './pages/ShadowAI';
import Guardrails from './pages/Guardrails';
import Forecasting from './pages/Forecasting';
import Settings from './pages/Settings';
import ApiKeys from './pages/ApiKeys';
import Upgrade from './pages/Upgrade';
import OAuthCallback from './pages/OAuthCallback';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandPalette from './components/CommandPalette';
import useAuthStore from './store/authStore';

function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  const state = useAuthStore();
  const user = state?.user;
  const token = state?.token;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Immediately set loading to false to display something
    setLoading(false);
  }, []);

  const isAuthenticated = !!(token && user);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <CommandPalette />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/app/dashboard" /> : <Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/app/dashboard" /> : <Login />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/onboarding" /> : <Signup />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route
          path="/onboarding"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <Onboarding />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />

        {/* Protected Routes */}
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />

        <Route
          path="/app/dashboard"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/usage"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <AIUsage />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/token-attribution"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <TokenAttribution />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/infrastructure"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <Infrastructure />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/vector-storage"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <VectorStorage />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/shadow-ai"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <ShadowAI />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/guardrails"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <Guardrails />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/forecasting"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <Forecasting />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/settings"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/settings/api-keys"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <ApiKeys />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />
        <Route
          path="/app/billing"
          element={isAuthenticated ? (
            <ProtectedLayout>
              <Upgrade />
            </ProtectedLayout>
          ) : <Navigate to="/login" />}
        />

        {/* Back-compat redirects */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/ai-usage" element={<Navigate to="/app/usage" replace />} />
        <Route path="/token-attribution" element={<Navigate to="/app/token-attribution" replace />} />
        <Route path="/infrastructure" element={<Navigate to="/app/infrastructure" replace />} />
        <Route path="/vector-storage" element={<Navigate to="/app/vector-storage" replace />} />
        <Route path="/shadow-ai" element={<Navigate to="/app/shadow-ai" replace />} />
        <Route path="/guardrails" element={<Navigate to="/app/guardrails" replace />} />
        <Route path="/forecasting" element={<Navigate to="/app/forecasting" replace />} />
        <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        <Route path="/upgrade" element={<Navigate to="/app/billing" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

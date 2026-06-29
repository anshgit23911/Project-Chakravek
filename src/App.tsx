import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import RiskAnalyticsPage from "./pages/RiskAnalyticsPage";
import ContractsPage from "./pages/ContractsPage";
import AIAdviserPage from "./pages/AIAdviserPage";
import CAGAssistantPage from "./pages/CAGAssistantPage";
import AuditReportPage from "./pages/AuditReportPage";
import DataManagementPage from "./pages/DataManagementPage";
import ProfilePage from "./pages/ProfilePage";
import InfoPage from "./pages/InfoPage";
import Navigation from "./components/Navigation";
import { User } from "./types";

function AppContent({
  currentUser,
  setCurrentUser,
  handleLogout
}: {
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  handleLogout: () => void;
}) {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="flex h-dvh overflow-hidden bg-cyber-bg text-slate-100 font-sans">
      {/* Render application sidebar only if user exists and is not on the landing page */}
      {currentUser && !isLandingPage && (
        <Navigation user={currentUser} onLogout={handleLogout} />
      )}

      {/* Core content viewframe */}
      <div
        className={`flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden ${
          currentUser && !isLandingPage ? "pt-14 lg:pt-0" : ""
        }`}
      >
        {/* Render public header if not logged in OR if logged in but on the landing page */}
        {(!currentUser || isLandingPage) && (
          <Navigation user={currentUser} onLogout={handleLogout} forcePublicHeader={isLandingPage} />
        )}
        
        <main className="flex-1">
          <Routes>
            {/* Public Views */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route 
              path="/login" 
              element={!currentUser ? <LoginPage onLoginSuccess={setCurrentUser} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/signup" 
              element={!currentUser ? <SignUpPage onSignUpSuccess={setCurrentUser} /> : <Navigate to="/dashboard" />} 
            />

            {/* Protected Views */}
            <Route 
              path="/dashboard" 
              element={currentUser ? <DashboardPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/analytics" 
              element={currentUser ? <RiskAnalyticsPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/contracts" 
              element={currentUser ? <ContractsPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/ai-advisor" 
              element={currentUser ? <AIAdviserPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/audit-observations" 
              element={currentUser ? <CAGAssistantPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/audit-reports" 
              element={currentUser ? <AuditReportPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/data-management" 
              element={currentUser ? <DataManagementPage /> : <Navigate to="/" />} 
            />
            <Route 
              path="/profile" 
              element={currentUser ? <ProfilePage user={currentUser} onProfileUpdate={setCurrentUser} /> : <Navigate to="/" />} 
            />

            {/* Wildcard Fallback */}
            <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/"} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-cyber-bg text-slate-350">
        <Loader2 className="w-10 h-10 text-cyber-teal-light animate-spin mb-4" />
        <span className="text-xs font-mono tracking-widest uppercase">INITIALIZING CHAKRAVEK AI HANDSHAKE...</span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent 
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        handleLogout={handleLogout} 
      />
    </BrowserRouter>
  );
}

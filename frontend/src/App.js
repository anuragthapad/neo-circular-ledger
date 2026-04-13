import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { Toaster } from "./components/ui/sonner";
import LoginPage from "./pages/LoginPage";
import VillageWardDashboard from "./pages/VillageWardDashboard";
import PlantOperatorDashboard from "./pages/PlantOperatorDashboard";
import InvestorDashboard from "./pages/InvestorDashboard";
import AdminPanel from "./pages/AdminPanel";
import ImpactReport from "./pages/ImpactReport";

function ProtectedRoute({ role, children }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to={`/${currentUser.role}`} replace /> : <LoginPage />} />

      {/* Village Ward */}
      <Route path="/ward" element={<ProtectedRoute role="ward"><VillageWardDashboard /></ProtectedRoute>} />
      <Route path="/ward/entry" element={<ProtectedRoute role="ward"><VillageWardDashboard subPage="entry" /></ProtectedRoute>} />
      <Route path="/ward/ledger" element={<ProtectedRoute role="ward"><VillageWardDashboard subPage="ledger" /></ProtectedRoute>} />
      <Route path="/ward/impact" element={<ProtectedRoute role="ward"><ImpactReport /></ProtectedRoute>} />
      <Route path="/ward/notifications" element={<ProtectedRoute role="ward"><VillageWardDashboard subPage="notifications" /></ProtectedRoute>} />

      {/* Plant Operator */}
      <Route path="/plant" element={<ProtectedRoute role="plant"><PlantOperatorDashboard /></ProtectedRoute>} />
      <Route path="/plant/processing" element={<ProtectedRoute role="plant"><PlantOperatorDashboard subPage="processing" /></ProtectedRoute>} />
      <Route path="/plant/analytics" element={<ProtectedRoute role="plant"><PlantOperatorDashboard subPage="analytics" /></ProtectedRoute>} />
      <Route path="/plant/ledger" element={<ProtectedRoute role="plant"><PlantOperatorDashboard subPage="ledger" /></ProtectedRoute>} />
      <Route path="/plant/notifications" element={<ProtectedRoute role="plant"><PlantOperatorDashboard subPage="notifications" /></ProtectedRoute>} />

      {/* Investor */}
      <Route path="/investor" element={<ProtectedRoute role="investor"><InvestorDashboard /></ProtectedRoute>} />
      <Route path="/investor/marketplace" element={<ProtectedRoute role="investor"><InvestorDashboard subPage="marketplace" /></ProtectedRoute>} />
      <Route path="/investor/portfolio" element={<ProtectedRoute role="investor"><InvestorDashboard subPage="portfolio" /></ProtectedRoute>} />
      <Route path="/investor/leaderboard" element={<ProtectedRoute role="investor"><InvestorDashboard subPage="leaderboard" /></ProtectedRoute>} />
      <Route path="/investor/notifications" element={<ProtectedRoute role="investor"><InvestorDashboard subPage="notifications" /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminPanel subPage="users" /></ProtectedRoute>} />
      <Route path="/admin/ledger" element={<ProtectedRoute role="admin"><AdminPanel subPage="ledger" /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminPanel subPage="analytics" /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminPanel subPage="settings" /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}

export default App;

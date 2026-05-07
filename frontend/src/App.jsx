import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CommandesPage from './pages/dashboard/CommandesPage';
import AdminPage from './pages/admin/AdminPage';
import CommandeDetailPage from './pages/dashboard/CommandeDetailPage';
import NouvelleCommandePage from './pages/dashboard/NouvelleCommandePage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute role="AGENT">
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="commandes" element={<CommandesPage />} />
                <Route path="commandes/:id" element={<CommandeDetailPage />} />
                <Route path="commandes/nouvelle" element={<NouvelleCommandePage />} />
                <Route path="commandes/:id"      element={<CommandeDetailPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
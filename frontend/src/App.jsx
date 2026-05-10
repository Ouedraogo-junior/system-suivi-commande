import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

import LoginPage          from './pages/auth/LoginPage';
import DashboardPage      from './pages/dashboard/DashboardPage';
import CommandesPage      from './pages/dashboard/CommandesPage';
import CommandeDetailPage from './pages/dashboard/CommandeDetailPage';
import NouvelleCommandePage from './pages/dashboard/NouvelleCommandePage';
import ClientsPage        from './pages/dashboard/ClientsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAgentsPage    from './pages/admin/AdminAgentsPage';
import TransactionsPage   from './pages/admin/TransactionsPage';
import StatistiquesPage   from './pages/admin/StatistiquesPage';
import NonSoldeesPage     from './pages/admin/NonSoldeesPage';
import PublicLayout       from './pages/public/PublicLayout';
import AccueilRoute       from './pages/public/AccueilRoute';
import ServicesPage       from './pages/public/ServicesPage';
import AProposPage     from './pages/public/AProposPage';
import ContactPage     from './pages/public/ContactPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route path="/login" element={<LoginPage />} />

        {/* ── Espace public — racine / ── */}
        <Route path="/" element={<PublicLayout />}>
          <Route index           element={<AccueilRoute />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="apropos"  element={<AProposPage />} />
          <Route path="contact"  element={<ContactPage />} />
        </Route>

        {/* ── Espace agent ── */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute role="AGENT">
              <Routes>
                <Route index                     element={<DashboardPage />} />
                <Route path="commandes"          element={<CommandesPage />} />
                <Route path="commandes/nouvelle" element={<NouvelleCommandePage />} />
                <Route path="commandes/:id"      element={<CommandeDetailPage />} />
                <Route path="clients"            element={<ClientsPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* ── Espace admin ── */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="ADMIN">
              <Routes>
                <Route index                     element={<AdminDashboardPage />} />
                <Route path="commandes"          element={<CommandesPage />} />
                <Route path="commandes/nouvelle" element={<NouvelleCommandePage />} />
                <Route path="commandes/:id"      element={<CommandeDetailPage />} />
                <Route path="clients"            element={<ClientsPage />} />
                <Route path="agents"             element={<AdminAgentsPage />} />
                <Route path="transactions"       element={<TransactionsPage />} />
                <Route path="statistiques"       element={<StatistiquesPage />} />
                <Route path="non-soldees"        element={<NonSoldeesPage />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AuthProvider>
  );
}
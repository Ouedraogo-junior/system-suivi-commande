import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loader}>
        <div style={styles.spinner} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

const styles = {
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: 'var(--cream)',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--green-dark)',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};
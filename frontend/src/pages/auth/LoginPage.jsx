import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login, user }   = useAuth();
  const navigate          = useNavigate();
  const [form, setForm]   = useState({ pseudo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Redirection si déjà connecté
  useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(form.pseudo, form.password);
      navigate(loggedUser.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo / En-tête */}
        <div style={styles.header}>
          {!logoError ? (
            <img
              src="/images/logo.png"
              alt="SOGECOP"
              style={styles.logoImg}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div style={styles.logo}>S</div>
          )}
          {/* <h1 style={styles.title}>SOGECOP</h1> */}
          <p style={styles.subtitle}>Espace de gestion interne</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Pseudo</label>
            <input
              type="text"
              name="pseudo"
              value={form.pseudo}
              onChange={handleChange}
              placeholder="Votre identifiant"
              style={styles.input}
              autoComplete="username"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={styles.passwordInput}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                style={styles.toggleBtn}
                aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                tabIndex={-1}
              >
                {showPassword ? (
                  // Icône "œil barré" (masquer)
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Icône "œil" (afficher)
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p style={styles.footer}>
          © {new Date().getFullYear()} SOGECOP Sarl — Tous droits réservés
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--cream)',
    padding: '1rem',
  },
  card: {
    backgroundColor: 'var(--white)',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    padding: '2.5rem 2rem',
    width: '100%',
    maxWidth: '420px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  logo: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--green-dark)',
    color: 'var(--white)',
    fontSize: '1.6rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 0.8rem',
  },
  // title: {
  //   fontSize: '1.5rem',
  //   fontWeight: '700',
  //   color: 'var(--green-dark)',
  //   letterSpacing: '0.05em',
  // },
  subtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    marginTop: '0.3rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-dark)',
  },
  input: {
    padding: '0.65rem 0.9rem',
    borderRadius: '8px',
    border: '1.5px solid #d1d5db',
    fontSize: '0.95rem',
    color: 'var(--text-dark)',
    backgroundColor: 'var(--white)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    width: '100%',
    padding: '0.65rem 2.6rem 0.65rem 0.9rem',
    borderRadius: '8px',
    border: '1.5px solid #d1d5db',
    fontSize: '0.95rem',
    color: 'var(--text-dark)',
    backgroundColor: 'var(--white)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    position: 'absolute',
    right: '0.7rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    borderRadius: '8px',
    padding: '0.65rem 0.9rem',
    fontSize: '0.875rem',
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  footer: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '2rem',
  },
  logoImg: {
  width: '300px',
  height: '150px',
  objectFit: 'contain',
  margin: '0 auto 0.8rem',
  display: 'block',
},
};
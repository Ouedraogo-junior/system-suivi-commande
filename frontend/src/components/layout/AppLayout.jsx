import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AppLayout.module.css';

// ===== ICÔNES =====
const Icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  commandes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/>
    </svg>
  ),
  agents: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  transactions: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  statistiques: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  nonSoldees: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 8v4l3 3"/>
    </svg>
  ),
  clients: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
};

// ===== NAVIGATION PAR RÔLE =====
const NAV_ADMIN = [
  {
    section: 'Tableau de bord',
    links: [
      { label: 'Vue globale',  icon: Icons.dashboard,     to: '/admin' },
      { label: 'Commandes',    icon: Icons.commandes,     to: '/admin/commandes' },
      { label: 'Clients',     icon: Icons.clients,    to: '/admin/clients' },
      { label: 'Agents',       icon: Icons.agents,        to: '/admin/agents' },
    ],
  },
  {
    section: 'Comptabilité',
    links: [
      { label: 'Transactions', icon: Icons.transactions,  to: '/admin/transactions' },
      { label: 'Statistiques', icon: Icons.statistiques,  to: '/admin/statistiques' },
      { label: 'Non soldées',  icon: Icons.nonSoldees,    to: '/admin/non-soldees' },
    ],
  },
];

const NAV_AGENT = [
  {
    section: 'Espace agent',
    links: [
      { label: 'Tableau de bord', icon: Icons.dashboard,  to: '/dashboard' },
      { label: 'Commandes',       icon: Icons.commandes,  to: '/dashboard/commandes' },
      { label: 'Clients',         icon: Icons.clients,    to: '/dashboard/clients' },
    ],
  },
];

// ===== INITIALES =====
function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ===== COMPOSANT SIDEBAR =====
function Sidebar({ user, onLogout, isOpen, onClose }) {
  const nav = user?.role === 'ADMIN' ? NAV_ADMIN : NAV_AGENT;

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Logo */}
        <div className={styles.sbLogo}>
          <div className={styles.sbLogoName}>SOGECOP</div>
          <span className={styles.sbLogoRole}>
            {user?.role === 'ADMIN' ? 'Administrateur' : 'Agent'}
          </span>
        </div>

        {/* Navigation */}
        <nav className={styles.sbNav}>
          {nav.map((group) => (
            <div key={group.section}>
              <div className={styles.sbSection}>{group.section}</div>
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/admin' || link.to === '/dashboard'}
                  className={({ isActive }) =>
                    `${styles.sbLink} ${isActive ? styles.sbLinkOn : ''}`
                  }
                  onClick={onClose}
                >
                  <span className={styles.sbIcon}>{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Profil + Logout */}
        <div className={styles.sbBottom}>
          <div className={styles.sbAgent}>
            <div className={styles.sbAvatar}>{getInitials(user?.nom_complet)}</div>
            <div className={styles.sbAgentInfo}>
              <div className={styles.sbAgentName}>{user?.nom_complet}</div>
              <div className={styles.sbAgentRole}>
                {user?.role === 'ADMIN' ? 'Administrateur' : 'Agent'}
              </div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={onLogout}>
            <span className={styles.sbIcon}>{Icons.logout}</span>
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}

// ===== COMPOSANT TOPBAR =====
function Topbar({ title, subtitle, onMenuClick, children }) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          {Icons.menu}
        </button>
        <div>
          <div className={styles.topbarTitle}>{title}</div>
          {subtitle && <div className={styles.topbarSub}>{subtitle}</div>}
        </div>
      </div>
      <div className={styles.topbarRight}>{children}</div>
    </header>
  );
}

// ===== LAYOUT PRINCIPAL =====
export default function AppLayout({ title, subtitle, topbarActions, children }) {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className={styles.shell}>
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.main}>
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        >
          {topbarActions}
        </Topbar>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

// Exports nommés pour réutilisation
export { Topbar, Sidebar, Icons, getInitials };
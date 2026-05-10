// src/pages/public/components/NavPublic.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavPublic.module.css';

const LABELS = {
  fr: { accueil: 'Accueil', apropos: 'À propos', services: 'Services', contact: 'Contact' },
  en: { accueil: 'Home',    apropos: 'About',    services: 'Services', contact: 'Contact' },
};

export default function NavPublic({ lang, setLang }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const t = LABELS[lang];

  const links = [
    { label: t.accueil, to: '/'          },
    { label: t.apropos, to: '/apropos'  },
    { label: t.services,to: '/services' },
    { label: t.contact, to: '/contact'  },
  ];

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <div className={styles.logoMark}><span>SC</span></div>
        <div className={styles.logoBrand}>SOGECOP</div>
      </Link>

      <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`${styles.link} ${location.pathname === l.to ? styles.linkActive : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className={styles.right}>
        <div className={styles.langSwitch}>
          <button
            className={`${styles.langBtn} ${lang === 'fr' ? styles.langActive : ''}`}
            onClick={() => setLang('fr')}
          >FR</button>
          <span className={styles.langSep}>|</span>
          <button
            className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`}
            onClick={() => setLang('en')}
          >EN</button>
        </div>

        <button
          className={styles.burger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
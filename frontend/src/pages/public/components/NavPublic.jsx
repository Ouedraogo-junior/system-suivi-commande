import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './NavPublic.module.css';

const LABELS = {
  fr: { accueil: 'Accueil', apropos: 'À propos', services: 'Services', contact: 'Contact' },
  en: { accueil: 'Home',    apropos: 'About',    services: 'Services', contact: 'Contact' },
};

const LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English'  },
];

export default function NavPublic({ lang, setLang }) {
  const location = useLocation();
  const t = LABELS[lang];
  const links = [
    { label: t.accueil,  to: '/'          },
    { label: t.apropos,  to: '/apropos'   },
    { label: t.services, to: '/services'  },
    { label: t.contact,  to: '/contact'   },
  ];
  const logoSrc = '/logo/logo_1.svg';

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLang = (code) => {
    setLang(code);
    setLangOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        {logoSrc ? (
          <img src={logoSrc} alt="SOGECOP" className={styles.logoImg} />
        ) : (
          <div className={styles.logoMark}><span>SC</span></div>
        )}
      </Link>

      <div className={styles.links}>
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`${styles.link} ${location.pathname === l.to ? styles.linkActive : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className={styles.right}>
        <div className={styles.langDropdown} ref={langRef}>
          <button
            className={styles.langTrigger}
            onClick={() => setLangOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
          >
            {lang.toUpperCase()}
            <svg className={styles.langChevron} width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {langOpen && (
            <ul className={styles.langMenu} role="listbox">
              {LANGS.map(l => (
                <li key={l.code}>
                  <button
                    className={`${styles.langOption} ${lang === l.code ? styles.langOptionActive : ''}`}
                    onClick={() => selectLang(l.code)}
                    role="option"
                    aria-selected={lang === l.code}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
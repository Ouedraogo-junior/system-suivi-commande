// src/pages/public/components/FooterPublic.jsx
// import { Link } from 'react-router-dom';
import styles from './FooterPublic.module.css';
import LogoAssembly from './LogoAssembly';
import { useEffect, useState } from 'react';

const LABELS = {
  fr: {
    tagline: 'Votre partenaire de confiance pour des solutions complètes et innovantes.',
    // links: ['Accueil', 'À propos', 'Services', 'Contact'],
    rights: '© 2026 SOGECOP Sarl — Tous droits réservés',
    hours: 'Lun–Ven : 07h30–17h30 · Sam : 08h00–15h00',
    // login: 'Espace client',
  },
  en: {
    tagline: 'Your trusted partner for complete and innovative solutions.',
    // links: ['Home', 'About', 'Services', 'Contact'],
    rights: '© 2026 SOGECOP Sarl — All rights reserved',
    hours: 'Mon–Fri: 7:30am–5:30pm · Sat: 8:00am–3:00pm',
    // login: 'Client portal',
  },
};

// const ROUTES = ['/', '/apropos', '/services', '/contact'];

export default function FooterPublic({ lang }) {
  const t = LABELS[lang];
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCycle(c => c + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div style={{ width: '100%', '--logo-width': '70%', '--logo-cap': '1000px' }}>
          <LogoAssembly />
        </div>

        <div className={styles.devise} key={cycle}>
          {t.tagline.split(' ').map((word, i) => (
            <span
              key={i}
              className={styles.deviseWord}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <span>{t.rights}</span>
        <span>{t.hours}</span>
        {/* <Link to="/login" className={styles.loginLink}>{t.login} →</Link> */}
      </div>
    </footer>
  );
}
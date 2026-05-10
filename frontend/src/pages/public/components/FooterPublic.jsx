// src/pages/public/components/FooterPublic.jsx
import { Link } from 'react-router-dom';
import styles from './FooterPublic.module.css';

const LABELS = {
  fr: {
    tagline: 'Votre partenaire de confiance au Burkina Faso.',
    links: ['Accueil', 'À propos', 'Services', 'Contact'],
    rights: '© 2025 SOGECOP Sarl — Tous droits réservés',
    hours: 'Lun–Ven : 07h30–17h30 · Sam : 08h00–15h00',
    login: 'Espace client',
  },
  en: {
    tagline: 'Your trusted partner in Burkina Faso.',
    links: ['Home', 'About', 'Services', 'Contact'],
    rights: '© 2025 SOGECOP Sarl — All rights reserved',
    hours: 'Mon–Fri: 7:30am–5:30pm · Sat: 8:00am–3:00pm',
    login: 'Client portal',
  },
};

const ROUTES = ['/', '/apropos', '/services', '/contact'];

export default function FooterPublic({ lang }) {
  const t = LABELS[lang];

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logoMark}><span>SC</span></div>
          <div>
            <div className={styles.logoName}>SOGECOP</div>
            <div className={styles.tagline}>{t.tagline}</div>
          </div>
        </div>

        <div className={styles.links}>
          {t.links.map((label, i) => (
            <Link key={i} to={ROUTES[i]} className={styles.link}>{label}</Link>
          ))}
        </div>

        <div className={styles.contact}>
          <div className={styles.contactItem}>sogecop.sarl.bf@gmail.com</div>
          <div className={styles.contactItem}>+226 55 08 86 36</div>
          <div className={styles.contactItem}>Ouaga 2000, Burkina Faso</div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>{t.rights}</span>
        <span>{t.hours}</span>
        <Link to="/login" className={styles.loginLink}>{t.login} →</Link>
      </div>
    </footer>
  );
}
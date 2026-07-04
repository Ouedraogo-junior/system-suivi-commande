// src/pages/public/components/contact/HeroContact.jsx
import { Link } from 'react-router-dom';
import styles from './ContactComponents.module.css';

export default function HeroContact({ t }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBgShape} />
      <div className={styles.heroBgShape2} />
      <div className={styles.heroInner}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>{t.breadcrumbHome}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{t.pageLabel}</span>
        </div>
        <div className={styles.heroLabel}>{t.hero.label}</div>
        <h1 className={styles.heroTitle}>{t.hero.title}</h1>
        <p className={styles.heroSub}>{t.hero.sub}</p>
      </div>
    </section>
  );
}
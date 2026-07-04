// src/pages/public/components/services/HeroServices.jsx
import { Link } from 'react-router-dom';
import styles from './ServicesComponents.module.css';

export default function HeroServices({ t, activeTab, domainIcons, onTabClick }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBgShape} />
      <div className={styles.heroBgShape2} />
      <div className={styles.heroInner}>
        <div className={styles.breadcrumb}>
          <Link to="/" className={styles.breadcrumbLink}>{t.breadcrumbHome}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{t.heroLabel}</span>
        </div>
        <div className={styles.heroLabel}>{t.heroLabel}</div>
        <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
        <p className={styles.heroSub}>{t.heroSub}</p>
        <div className={styles.heroTabs}>
          {t.domaines.map((d, i) => (
            <button
              key={d.id}
              className={`${styles.heroTab} ${activeTab === i ? styles.heroTabActive : ''}`}
              onClick={() => onTabClick(i, d.id)}
            >
              <span className={styles.heroTabIcon}>{domainIcons[i]}</span>
              <span className={styles.heroTabLabel}>{d.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
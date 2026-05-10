// src/pages/public/components/apropos/Histoire.jsx
import styles from './AProposComponents.module.css';

export default function Histoire({ t }) {
  const h = t.histoire;
  return (
    <section className={styles.histoire}>
      <div className={styles.histoireLeft}>
        <div className={styles.sectionLabel}>{h.label}</div>
        <h2 className={styles.sectionTitle}>{h.title}</h2>
        {h.body.map((p, i) => (
          <p key={i} className={styles.sectionBody}>{p}</p>
        ))}
      </div>
      <div className={styles.histoireRight}>
        <div className={styles.chiffresGrid}>
          {h.chiffres.map((c, i) => (
            <div key={i} className={styles.chiffreCard}>
              <div className={styles.chiffreNum}>{c.num}</div>
              <div className={styles.chiffreLbl}>{c.lbl}</div>
            </div>
          ))}
        </div>
        <div className={styles.histoireVisual}>
          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <span>Photo siège / équipe</span>
        </div>
      </div>
    </section>
  );
}
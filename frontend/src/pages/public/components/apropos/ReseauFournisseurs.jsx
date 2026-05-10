// src/pages/public/components/apropos/ReseauFournisseurs.jsx
import styles from './AProposComponents.module.css';

export default function ReseauFournisseurs({ t }) {
  const r = t.reseau;
  return (
    <section className={styles.reseau}>
      <div className={styles.reseauLeft}>
        <div className={styles.sectionLabel}>{r.label}</div>
        <h2 className={styles.sectionTitle}>{r.title}</h2>
        <p className={styles.sectionBody}>{r.body}</p>
        <div className={styles.reseauRegions}>
          {r.regions.map((reg, i) => (
            <div key={i} className={styles.regionCard}>
              <div className={styles.regionHeader}>
                <div className={styles.regionName}>{reg.region}</div>
              </div>
              <p className={styles.regionDesc}>{reg.desc}</p>
              <div className={styles.regionPays}>
                {reg.pays.map((p, j) => (
                  <span key={j} className={styles.paysBadge}>{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.reseauRight}>
        <div className={styles.reseauMapPlaceholder}>
          <svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24" style={{ color: 'var(--green-dark)', opacity: 0.35 }}>
            <circle cx="12" cy="12" r="10"/>
            <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
          </svg>
          <span>Carte du réseau</span>
          <span style={{ fontSize: '11px', opacity: 0.5 }}>À intégrer</span>
        </div>
      </div>
    </section>
  );
}
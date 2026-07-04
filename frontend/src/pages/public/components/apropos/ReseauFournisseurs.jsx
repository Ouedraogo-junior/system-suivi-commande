// src/pages/public/components/apropos/ReseauFournisseurs.jsx
import styles from './AProposComponents.module.css';
import FournGlobe from '../FournGlobe';

export default function ReseauFournisseurs({ t }) {
  const r = t.reseau;
  return (
    <section className={styles.reseau}>
      <div className={`${styles.reseauLeft} revealLeft`} data-reveal>
        <div className={styles.sectionLabel}>{r.label}</div>
        <h2 className={styles.sectionTitle}>{r.title}</h2>
        <p className={styles.sectionBody}>{r.body}</p>
        <div className={styles.reseauRegions}>
          {r.regions.map((reg, i) => (
            <div className={`${styles.regionCard} regionCardAnim`}
              style={{ '--region-delay': `${i * 0.12}s` }}>
              <div className={styles.regionHeader}>
                <div className={styles.regionName}>{reg.region}</div>
              </div>
              <p className={styles.regionDesc}>{reg.desc}</p>
              {/* <div className={styles.regionPays}>
                {reg.pays.map((p, j) => (
                  <span key={j} className={styles.paysBadge}>{p}</span>
                ))}
              </div> */}
            </div>
          ))}
        </div>
      </div>
      {/* Globe interactif — remplace le placeholder */}
        <div className={`${styles.reseauRight} revealRight`} data-reveal>
          <FournGlobe />
        </div>
    </section>
  );
}
// src/pages/public/components/apropos/Histoire.jsx
import styles from './AProposComponents.module.css';
import CarouselImages from '../CarouselImages';

export default function Histoire({ t }) {
  const h = t.histoire;
  return (
    <section className={styles.histoire}>
      <div className={`${styles.histoireLeft}  revealLeft`}  data-reveal>
        <div className={styles.sectionLabel}>{h.label}</div>
        <h2 className={styles.sectionTitle}>{h.title}</h2>
        {h.body.map((p, i) => (
          <p key={i} className={styles.sectionBody}>{p}</p>
        ))}
      </div>
     <div className={`${styles.histoireRight} revealRight`} data-reveal>
        {/* <div className={styles.chiffresGrid}>
          {h.chiffres.map((c, i) => (
            <div key={i} className={`${styles.chiffreCard} chiffreCardAnim`}
                style={{ '--chiffre-delay': `${i * 0.1}s` }}>
              <div className={styles.chiffreNum}>{c.num}</div>
              <div className={styles.chiffreLbl}>{c.lbl}</div>
            </div>
          ))}
        </div> */}
        {h.images && <CarouselImages slides={h.images} autoPlay interval={3500} />}
      </div>
    </section>
  );
}
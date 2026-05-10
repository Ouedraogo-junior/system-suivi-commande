// src/pages/public/components/apropos/Partenaires.jsx
import { useState } from 'react';
import styles from './AProposComponents.module.css';

export default function Partenaires({ t }) {
  const p = t.partenaires;
  const [current, setCurrent] = useState(0);
  const visible = 4;
  const max = Math.max(0, p.items.length - visible);

  return (
    <section className={styles.partenaires}>
      <div className={styles.partenairesHeader}>
        <div className={styles.sectionLabel}>{p.label}</div>
        <h2 className={styles.sectionTitle}>{p.title}</h2>
        <p className={styles.sectionBody}>{p.body}</p>
      </div>
      <div className={styles.carouselWrap}>
        <div className={styles.carouselTrack}>
          {p.items.slice(current, current + visible).map((label, i) => (
            <div key={i} className={styles.carouselItem}>
              {/* Remplacer par <img src="..." alt={label} /> */}
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className={styles.carouselControls}>
          <button
            className={styles.carouselBtn}
            onClick={() => setCurrent(c => Math.max(0, c - 1))}
            disabled={current === 0}
          >‹</button>
          <span className={styles.carouselDots}>
            {Array.from({ length: max + 1 }).map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${current === i ? styles.dotActive : ''}`}
                onClick={() => setCurrent(i)}
              />
            ))}
          </span>
          <button
            className={styles.carouselBtn}
            onClick={() => setCurrent(c => Math.min(max, c + 1))}
            disabled={current >= max}
          >›</button>
        </div>
      </div>
    </section>
  );
}
// src/pages/public/components/apropos/EngagementAssociatif.jsx
import styles from './AProposComponents.module.css';

export default function EngagementAssociatif({ t }) {
  const e = t.engagement;
  return (
    <section className={styles.engagement}>
      <div className={styles.engagementInner}>
        <div className={styles.sectionLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>{e.label}</div>
        <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>{e.title}</h2>
        <p className={styles.sectionBody} style={{ color: 'rgba(255,255,255,0.7)' }}>{e.body}</p>
        <div className={styles.engagementCards}>
          {e.items.map((item, i) => (
            <div key={i} className={styles.engagementCard}>
              <div className={styles.engagementNum}>{item.num}</div>
              <div className={styles.engagementTitle}>{item.title}</div>
              <div className={styles.engagementDesc}>{item.desc}</div>
            </div>
          ))}
        </div>
        <div className={styles.engagementImages}>
          {[1, 2, 3].map(n => (
            <div key={n} className={styles.engagementImgPlaceholder}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>Photo {n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
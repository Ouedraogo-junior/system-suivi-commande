// src/pages/public/components/apropos/Valeurs.jsx
import styles from './AProposComponents.module.css';

const ICONS = [
  // Excellence
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  // Fiabilité
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.049-.12-2.07-.382-3.016z"/></svg>,
  // Proximité
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  // Innovation
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
];

const COLORS = ['var(--green-dark)', 'var(--brown)', 'var(--green-dark)', 'var(--brown)'];

export default function Valeurs({ t }) {
  const v = t.valeurs;
  return (
    <section className={styles.valeurs}>
      <div className={styles.valeursHeader}>
        <div className={styles.sectionLabel}>{v.label}</div>
        <h2 className={styles.sectionTitle}>{v.title}</h2>
      </div>
      <div className={styles.valeursGrid}>
        {v.items.map((item, i) => (
          <div key={i} className={styles.valeurCard}>
            <div className={styles.valeurIconWrap} style={{ background: COLORS[i] }}>
              {ICONS[i]}
            </div>
            <div className={styles.valeurTitle}>{item.title}</div>
            <div className={styles.valeurBody}>{item.body}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
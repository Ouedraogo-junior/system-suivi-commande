// src/pages/public/components/apropos/Valeurs.jsx
import { useState } from 'react';
import styles from './AProposComponents.module.css';

/* ── Icônes ── */
const ICONS = [
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" key="excellence">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>,
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" key="integrite">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" key="satisfaction">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>,
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" key="innovation">
    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
  </svg>,
];

const COLORS = ['var(--green-dark)', 'var(--brown)', 'var(--green-dark)', 'var(--brown)'];
const MAX_CHARS = 160;

/* ── ExpandableText — défini au niveau module (stable entre renders) ── */
function ExpandableText({ text, lang }) {
  const [expanded, setExpanded] = useState(false);
  const labels = { fr: ['Voir plus', 'Voir moins'], en: ['Read more', 'Read less'] };
  const [more, less] = labels[lang] ?? labels.fr;

  if (text.length <= MAX_CHARS) {
    return <p className={styles.valeurBody}>{text}</p>;
  }

  return (
    <p className={styles.valeurBody}>
      {expanded ? text : `${text.slice(0, MAX_CHARS).trimEnd()}…`}
      <button
        type="button"
        className={styles.valeurToggle}
        onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
        aria-expanded={expanded}
      >
        {expanded ? less : more}
      </button>
    </p>
  );
}

/* ── Carte individuelle — son propre composant évite le reset de state ── */
function ValeurCard({ item, index }) {
  return (
    <div
      className={`${styles.valeurCard} valeurCardAnim`}
      style={{ '--valeur-delay': `${index * 0.1}s` }}
    >
      <div
        className={styles.valeurIconWrap}
        style={{ background: COLORS[index % COLORS.length] }}
      >
        {ICONS[index % ICONS.length]}
      </div>
      <div className={styles.valeurTitle}>{item.title}</div>
      <ExpandableText text={item.body} lang={item.lang} />
    </div>
  );
}

/* ── Composant principal ── */
export default function Valeurs({ t, lang = 'fr' }) {
  const v = t.valeurs;

  // Injecte lang dans chaque item pour que ExpandableText y ait accès
  const items = v.items.map(item => ({ ...item, lang }));

  return (
    <section className={styles.valeurs}>
      <div className={`${styles.valeursHeader} revealUp`} data-reveal>
        <div className={styles.sectionLabel}>{v.label}</div>
        <h2 className={styles.sectionTitle}>{v.title}</h2>
      </div>
      <div className={`${styles.valeursGrid} revealUp`} data-reveal>
        {items.map((item, i) => (
          <ValeurCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
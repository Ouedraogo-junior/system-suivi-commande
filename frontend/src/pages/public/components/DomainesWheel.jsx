// src/pages/public/components/DomainesWheel.jsx
import { useState, useEffect } from 'react';
import styles from './DomainesWheel.module.css';

// ─── 4 quadrants : angles SVG pour chaque quart de disque ────
// Coordonnées calculées pour un cercle de rayon 128, centre (150,150)
// Chaque secteur = 90°
const QUADRANTS = [
  {
    // Haut-gauche  (270° → 360°, soit -90° → 0°)
    path: 'M150,150 L150,22 A128,128 0 0,1 278,150 Z',
    labelX: 196,
    labelY: 102,
    iconX:  196,
    iconY:  78,
  },
  {
    // Haut-droite  (0° → 90°)
    path: 'M150,150 L278,150 A128,128 0 0,1 150,278 Z',
    labelX: 196,
    labelY: 200,
    iconX:  196,
    iconY:  225,
  },
  {
    // Bas-droite   (90° → 180°)
    path: 'M150,150 L150,278 A128,128 0 0,1 22,150 Z',
    labelX: 104,
    labelY: 200,
    iconX:  104,
    iconY:  225,
  },
  {
    // Bas-gauche   (180° → 270°)
    path: 'M150,150 L22,150 A128,128 0 0,1 150,22 Z',
    labelX: 104,
    labelY: 102,
    iconX:  104,
    iconY:  78,
  },
];

// Couleurs : deux verts sombres, deux marrons — alternés pour lisibilité
const FILLS   = ['#1e6b31', '#7a5230', '#1e6b31', '#7a5230'];
const FILLS_H = ['#2a8a40', '#9b6a3e', '#2a8a40', '#9b6a3e'];

// Icônes SVG simples (stroke blanc) pour chaque domaine
const ICONS = [
  // Imprimerie / print
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
  </svg>,
  // Numérique / écran
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>,
  // Communication / globe
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
  </svg>,
  // Marketing / bullhorn
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13"/><path d="M22 2L15 22 11 13 2 9l20-7z"/>
  </svg>,
];

function splitLabel(label = '') {
  const words = label.split(' ');
  let l1 = '', l2 = '';
  for (const w of words) {
    if ((l1 + ' ' + w).trim().length <= 14) l1 = (l1 + ' ' + w).trim();
    else l2 = (l2 + ' ' + w).trim();
  }
  return [l1, l2];
}

export default function DomainesWheel({ domaines = [], title = '' }) {
  const [hovered, setHovered] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const [ready,   setReady]   = useState(false);

  // Petit délai avant de démarrer les animations (laisse le hero se charger)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(t);
  }, [animKey]);

  const domains = domaines.slice(0, 4);
  while (domains.length < 4) domains.push(`Domaine ${domains.length + 1}`);

  return (
    <div className={styles.wrapper}>
      {title && <p className={styles.title}>{title}</p>}

      <div className={styles.svgWrap}>
        <svg
          key={animKey}
          viewBox="0 0 300 300"
          width="290"
          height="290"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="Roue des domaines d'activité"
        >
          <defs>
            <filter id={`shadow-${animKey}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="8"
                floodColor="rgba(0,0,0,0.5)" floodOpacity="1" />
            </filter>
          </defs>

          {/* ── Fond du disque ── */}
          <circle cx="150" cy="150" r="128" fill="#163d1e" />

          {/* ── 4 secteurs ── */}
          {QUADRANTS.map((q, i) => {
            const isHov = hovered === i;
            const label = domains[i];
            const [l1, l2] = splitLabel(label);
            const animClass = ready ? styles[`sector${i}`] : '';

            return (
              <g
                key={i}
                className={`${styles.sector} ${animClass}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  filter: isHov ? `url(#shadow-${animKey})` : undefined,
                  cursor: 'pointer',
                }}
              >
                {/* Secteur coloré */}
                <path
                  d={q.path}
                  fill={isHov ? FILLS_H[i] : FILLS[i]}
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1.5"
                  className={styles.sectorPath}
                  style={{
                    transformOrigin: '150px 150px',
                    transition: 'fill 160ms ease',
                  }}
                />

                {/* Icône SVG foreignObject — centré dans le secteur */}
                <foreignObject
                  x={q.iconX - 11}
                  y={q.iconY - 11}
                  width="22"
                  height="22"
                  style={{ pointerEvents: 'none', opacity: isHov ? 1 : 0.65, transition: 'opacity 160ms' }}
                >
                  {ICONS[i]}
                </foreignObject>

                {/* Label — ligne 1 */}
                <text
                  x={q.labelX}
                  y={l2 ? q.labelY - 6 : q.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="11"
                  fontFamily="'DM Sans', sans-serif"
                  fontWeight="700"
                  fill="#ffffff"
                  letterSpacing="0.3"
                  style={{ pointerEvents: 'none' }}
                >
                  {l1}
                </text>

                {/* Label — ligne 2 (si nécessaire) */}
                {l2 && (
                  <text
                    x={q.labelX}
                    y={q.labelY + 9}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fontFamily="'DM Sans', sans-serif"
                    fontWeight="700"
                    fill="#ffffff"
                    letterSpacing="0.3"
                    style={{ pointerEvents: 'none' }}
                  >
                    {l2}
                  </text>
                )}

                {/* Indicateur doré au hover */}
                {isHov && (
                  <circle
                    cx={q.labelX}
                    cy={q.labelY + (l2 ? 24 : 18)}
                    r="3"
                    fill="rgba(201,168,76,0.9)"
                    className={styles.goldDot}
                  />
                )}
              </g>
            );
          })}

          {/* ── Séparateurs en croix ── */}
          <line x1="150" y1="22"  x2="150" y2="278" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <line x1="22"  y1="150" x2="278" y2="150" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

          {/* ── Cercle central ── */}
          <circle cx="150" cy="150" r="36"
            fill="#1a5c2a"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            className={styles.centerCircle}
          />
          {/* Anneau doré */}
          <circle cx="150" cy="150" r="36"
            fill="none"
            stroke="rgba(201,168,76,0.35)"
            strokeWidth="1.5"
            className={styles.centerRing}
          />
          <text x="150" y="146" textAnchor="middle"
            fontSize="9.5" fontFamily="'Playfair Display', serif" fontWeight="600"
            fill="rgba(255,255,255,0.7)" letterSpacing="0.8"
            className={styles.centerText}
          >NOS</text>
          <text x="150" y="159" textAnchor="middle"
            fontSize="9.5" fontFamily="'Playfair Display', serif" fontWeight="600"
            fill="rgba(255,255,255,0.7)" letterSpacing="0.8"
            className={styles.centerText}
          >MÉTIERS</text>

          {/* ── Anneau extérieur ── */}
          <circle cx="150" cy="150" r="130"
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="2"
            className={styles.outerRing}
          />
        </svg>
      </div>

      {/* Label actif */}
      <div className={styles.activeLabel}>
        {hovered !== null ? (domains[hovered] ?? '') : '\u00a0'}
      </div>

      {/* Replay */}
      <button
        className={styles.replayBtn}
        onClick={() => { setReady(false); setTimeout(() => setAnimKey(k => k + 1), 30); }}
        aria-label="Rejouer l'animation"
      >
        ↺ Rejouer
      </button>
    </div>
  );
}
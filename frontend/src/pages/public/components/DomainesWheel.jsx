// src/pages/public/components/DomainesWheel.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DomainesWheel.module.css';

// IDs des sections dans ServicesPage — ordre identique aux quadrants
const DOMAIN_IDS = ['imprimerie', 'informatique', 'negoce', 'amenagement'];

// ── ViewBox 360×360, rayon 160 ─────────────────────────────────
// Centre : cx=180, cy=180
// Arc    : de 180,20  à  340,180  (et permutations)
const R  = 160;  // rayon
const CX = 180;  // centre X
const CY = 180;  // centre Y

const QUADRANTS = [
  // Haut-droit
  {
    path:   `M${CX},${CY} L${CX},${CY - R} A${R},${R} 0 0,1 ${CX + R},${CY} Z`,
    labelX: CX + 68, labelY: CY - 55,
    iconX:  CX + 68, iconY:  CY - 100,
  },
  // Bas-droit
  {
    path:   `M${CX},${CY} L${CX + R},${CY} A${R},${R} 0 0,1 ${CX},${CY + R} Z`,
    labelX: CX + 68, labelY: CY + 55,
    iconX:  CX + 68, iconY:  CY + 100,
  },
  // Bas-gauche
  {
    path:   `M${CX},${CY} L${CX},${CY + R} A${R},${R} 0 0,1 ${CX - R},${CY} Z`,
    labelX: CX - 68, labelY: CY + 55,
    iconX:  CX - 68, iconY:  CY + 100,
  },
  // Haut-gauche
  {
    path:   `M${CX},${CY} L${CX - R},${CY} A${R},${R} 0 0,1 ${CX},${CY - R} Z`,
    labelX: CX - 68, labelY: CY - 55,
    iconX:  CX - 68, iconY:  CY - 100,
  },
];

const FILLS   = ['#1e6b31', '#7a5230', '#1e6b31', '#7a5230'];
const FILLS_H = ['#2a8a40', '#9b6a3e', '#2a8a40', '#9b6a3e'];

const ICONS = [
  <svg key="0" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>,
  <svg key="1" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>,
  <svg key="2" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
  </svg>,
  <svg key="3" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.80)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>,
];

// Labels sur 3 lignes max — textes réels
const LABELS = [
  ['Production &', 'Imprimerie', 'Numérique'],
  ['Fournitures', 'de consommables &', 'Matériels', 'Informatiques'],
  ['Négoce', 'International', ''],
  ['Aménagement', 'Intérieur &', 'Extérieur'],
];

// Durée totale d'un cycle d'animation (ms) — doit correspondre au CSS
const CYCLE_MS = 3600; // 1.29s delay dernier secteur + 0.28s durée + marge

export default function DomainesWheel({ domaines = [], title = '' }) {
  const navigate = useNavigate();
  const [hovered, setHovered]   = useState(null);
  const [animKey, setAnimKey]   = useState(0);
  const [ready,   setReady]     = useState(false);

  function handleSectorClick(i) {
    navigate(`/services#${DOMAIN_IDS[i]}`);
  }

  // Lance l'animation au montage puis en boucle
  useEffect(() => {
    // Délai avant que les classes d'animation soient ajoutées
    const tReady = setTimeout(() => setReady(true), 400);
    return () => clearTimeout(tReady);
  }, [animKey]);


  useEffect(() => {
    const tLoop = setTimeout(() => {
      setReady(false);
      setTimeout(() => setAnimKey(k => k + 1), 60);
    }, CYCLE_MS);
    return () => clearTimeout(tLoop);
  }, [animKey]);

  const domains = (domaines.length ? domaines : []).slice(0, 4);
  while (domains.length < 4) domains.push(`Domaine ${domains.length + 1}`);

  return (
    <div className={styles.wrapper}>
      {title && <p className={styles.title}>{title}</p>}

      <div className={styles.svgWrap}>
        <svg
          key={animKey}
          viewBox="0 0 360 360"
          width="340"
          height="340"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
          role="img"
          aria-label="Roue des domaines d'activité"
        >
          <defs>
            <filter id={`shadow-${animKey}`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="9" floodColor="rgba(0,0,0,0.5)" floodOpacity="1" />
            </filter>
          </defs>

          {/* Fond du disque */}
          <circle cx={CX} cy={CY} r={R} fill="#163d1e" />

          {QUADRANTS.map((q, i) => {
            const isHov = hovered === i;
            const lines = LABELS[i];
            const animClass = ready ? styles[`sector${i}`] : '';

            // Calcul vertical pour centrer les lignes de texte
            const lineH    = 16;
            const nonEmpty = lines.filter(Boolean).length;
            const totalH   = nonEmpty * lineH;
            const startY   = q.labelY - totalH / 2 + lineH / 2;

            return (
              <g
                key={i}
                className={`${styles.sector} ${animClass}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSectorClick(i)}
                style={{
                  filter: isHov ? `url(#shadow-${animKey})` : undefined,
                  cursor: 'pointer',
                }}
              >
                <path
                  d={q.path}
                  fill={isHov ? FILLS_H[i] : FILLS[i]}
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1.5"
                  className={styles.sectorPath}
                  style={{ transformOrigin: `${CX}px ${CY}px`, transition: 'fill 160ms ease' }}
                />

                {/* Icône */}
                <foreignObject
                  x={q.iconX - 13} y={q.iconY - 13}
                  width="26" height="26"
                  style={{
                    pointerEvents: 'none',
                    opacity: isHov ? 1 : 0.70,
                    transition: 'opacity 160ms',
                  }}
                >
                  {ICONS[i]}
                </foreignObject>

                {/* Lignes de texte */}
                {lines.map((line, li) =>
                  line ? (
                    <text
                      key={li}
                      x={q.labelX}
                      y={startY + li * lineH}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="11"
                      fontFamily="'DM Sans', sans-serif"
                      fontWeight="700"
                      fill="#ffffff"
                      letterSpacing="0.2"
                      style={{ pointerEvents: 'none' }}
                    >
                      {line}
                    </text>
                  ) : null
                )}

                {/* Point doré au hover */}
                {isHov && (
                  <circle
                    cx={q.labelX}
                    cy={startY + (nonEmpty - 1) * lineH + 14}
                    r="3.5"
                    fill="rgba(201,168,76,0.9)"
                    className={styles.goldDot}
                  />
                )}
              </g>
            );
          })}

          {/* Séparateurs */}
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <line x1={CX - R} y1={CY} x2={CX + R} y2={CY} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

          {/* Cercle central */}
          <circle cx={CX} cy={CY} r="42" fill="#1a5c2a" stroke="rgba(255,255,255,0.15)" strokeWidth="1" className={styles.centerCircle} />
          <circle cx={CX} cy={CY} r="42" fill="none" stroke="rgba(201,168,76,0.35)" strokeWidth="1.5" className={styles.centerRing} />
          <text x={CX} y={CY - 6}  textAnchor="middle" fontSize="11" fontFamily="'Playfair Display', serif" fontWeight="600" fill="rgba(255,255,255,0.75)" letterSpacing="1" className={styles.centerText}>NOS</text>
          <text x={CX} y={CY + 9}  textAnchor="middle" fontSize="11" fontFamily="'Playfair Display', serif" fontWeight="600" fill="rgba(255,255,255,0.75)" letterSpacing="1" className={styles.centerText}>MÉTIERS</text>

          {/* Anneau extérieur */}
          <circle cx={CX} cy={CY} r={R + 2} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2" className={styles.outerRing} />
        </svg>
      </div>

      {/* Label actif */}
      <div className={styles.activeLabel}>
        {hovered !== null ? (domains[hovered] ?? '') : '\u00a0'}
      </div>
    </div>
  );
}
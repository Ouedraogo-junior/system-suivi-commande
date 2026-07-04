// src/pages/public/components/FournGlobe.jsx
import { useEffect, useRef, useState } from 'react';
import styles from './FournGlobe.module.css';

const SUPPLIERS_DEFAULT = [
  { coords: [  2.35, 48.85], label: 'France',   region: 'Europe',  color: '#2d7a40' },
  { coords: [  9.18, 45.46], label: 'Italie',   region: 'Europe',  color: '#2d7a40' },
  { coords: [ -9.14, 38.71], label: 'Portugal', region: 'Europe',  color: '#2d7a40' },
  { coords: [ -7.09, 31.79], label: 'Maroc',    region: 'Afrique', color: '#c9a84c' },
  { coords: [  3.04, 36.74], label: 'Algérie',  region: 'Afrique', color: '#c9a84c' },
  { coords: [ 10.18, 36.81], label: 'Tunisie',  region: 'Afrique', color: '#c9a84c' },
  { coords: [ 31.24, 30.06], label: 'Égypte',   region: 'Afrique', color: '#c9a84c' },
  { coords: [  7.49,  9.06], label: 'Nigéria',  region: 'Afrique', color: '#c9a84c' },
  { coords: [116.40, 39.90], label: 'Chine',    region: 'Asie',    color: '#8B5E3C' },
  { coords: [ 77.20, 28.60], label: 'Inde',     region: 'Asie',    color: '#8B5E3C' },
  { coords: [103.80,  1.35], label: 'Singapour',region: 'Asie',    color: '#8B5E3C' },
  { coords: [139.70, 35.70], label: 'Japon',    region: 'Asie',    color: '#8B5E3C' },
];

const LEGEND = [
  { region: 'Afrique', color: '#c9a84c' },
  { region: 'Europe',  color: '#2d7a40' },
  { region: 'Asie',    color: '#8B5E3C' },
];

// Charge un script et attend que le global window[globalName] soit disponible
function loadScript(src, globalName) {
  return new Promise((resolve, reject) => {
    // Déjà disponible
    if (window[globalName]) { resolve(window[globalName]); return; }
    // Script déjà dans le DOM mais global pas encore prêt → attendre
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window[globalName]));
      existing.addEventListener('error', reject);
      return;
    }
    // Nouveau script
    const s = document.createElement('script');
    s.src = src;
    s.onload  = () => resolve(window[globalName]);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function FournGlobe({ suppliers = SUPPLIERS_DEFAULT }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({
    rotate:     [-12, -22],
    hovered:    null,
    isHovering: false,
    isDragging: false,
    lastX:      0,
    raf:        null,
  });
  const [tooltip, setTooltip] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function init() {
      // 1. Charger D3, puis TopoJSON (topojson dépend de rien, mais D3 d'abord par convention)
      const d3       = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js', 'd3');
      const topojson = await loadScript('https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js', 'topojson');

      // 2. Données géographiques
      const res   = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
      const world = await res.json();

      if (cancelled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const S   = stateRef.current;

      const W = 300, H = 300, RADIUS = 130;
      const cx = W / 2, cy = H / 2;

      const projection = d3.geoOrthographic()
        .scale(RADIUS)
        .translate([cx, cy])
        .clipAngle(90)
        .rotate(S.rotate);

      const geoPath = d3.geoPath(projection, ctx);
      const land    = topojson.feature(world, world.objects.countries);
      const grat    = d3.geoGraticule()();

      // Teste si un point [lon,lat] est sur la face visible
      function isVisible(lon, lat) {
        const [rlon, rlat] = projection.rotate();
        const dlon = (lon + rlon) * Math.PI / 180;
        const dlat = (lat + rlat) * Math.PI / 180;
        return Math.cos(dlat) * Math.cos(dlon) > 0;
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);

        // Halo
        const halo = ctx.createRadialGradient(cx - 25, cy - 25, RADIUS * 0.05, cx, cy, RADIUS * 1.18);
        halo.addColorStop(0,    'rgba(26,92,42,0)');
        halo.addColorStop(0.75, 'rgba(26,92,42,0.04)');
        halo.addColorStop(1,    'rgba(26,92,42,0.14)');
        ctx.beginPath(); ctx.arc(cx, cy, RADIUS + 10, 0, Math.PI * 2);
        ctx.fillStyle = halo; ctx.fill();

        // Océan
        const ocean = ctx.createRadialGradient(cx - 18, cy - 18, RADIUS * 0.08, cx, cy, RADIUS);
        ocean.addColorStop(0,    '#d6ecf4');
        ocean.addColorStop(0.65, '#bad8ea');
        ocean.addColorStop(1,    '#96c2d8');
        ctx.beginPath(); geoPath({ type: 'Sphere' });
        ctx.fillStyle = ocean; ctx.fill();

        // Graticule
        ctx.beginPath(); geoPath(grat);
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.lineWidth = 0.5; ctx.stroke();

        // Terres
        ctx.beginPath(); geoPath(land);
        ctx.fillStyle   = '#cddea8';
        ctx.strokeStyle = 'rgba(255,255,255,0.65)';
        ctx.lineWidth   = 0.4;
        ctx.fill(); ctx.stroke();

        // Contour globe
        ctx.beginPath(); geoPath({ type: 'Sphere' });
        ctx.strokeStyle = 'rgba(26,92,42,0.22)';
        ctx.lineWidth = 1.5; ctx.stroke();

        // Points fournisseurs
        suppliers.forEach((s, idx) => {
          if (!isVisible(s.coords[0], s.coords[1])) return;
          const proj = projection(s.coords);
          if (!proj) return;
          const [px, py] = proj;
          const isHov    = S.hovered === idx;
          const dotR     = isHov ? 7 : 5;

          if (isHov) {
            ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2);
            ctx.fillStyle = s.color + '40'; ctx.fill();
            ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
            ctx.fillStyle = s.color + '25'; ctx.fill();
          }

          ctx.beginPath(); ctx.arc(px, py, dotR + 2.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.65)'; ctx.fill();

          ctx.beginPath(); ctx.arc(px, py, dotR, 0, Math.PI * 2);
          ctx.fillStyle   = isHov ? '#fff' : s.color;
          ctx.strokeStyle = s.color;
          ctx.lineWidth   = 1.5;
          ctx.fill(); ctx.stroke();

          if (isHov) {
            ctx.font = 'bold 10.5px "DM Sans", sans-serif';
            const tw = ctx.measureText(s.label).width;
            const bx = px + 12, by = py - 10;
            ctx.fillStyle = 'rgba(20,40,20,0.88)';
            ctx.beginPath(); ctx.roundRect(bx - 4, by - 13, tw + 10, 18, 4);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.fillText(s.label, bx + 1, by);
          }
        });
      }

      function loop() {
        if (S.isHovering && !S.isDragging) {
          S.rotate[0] += 0.15;
          projection.rotate(S.rotate);
        }
        draw();
        S.raf = requestAnimationFrame(loop);
      }
      S.raf = requestAnimationFrame(loop);

      function toCanvas(e) {
        const rect   = canvas.getBoundingClientRect();
        const scaleX = W / rect.width;
        const scaleY = H / rect.height;
        return [(e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY];
      }

      function getHovered(mx, my) {
        let found = null;
        suppliers.forEach((s, idx) => {
          if (!isVisible(s.coords[0], s.coords[1])) return;
          const proj = projection(s.coords);
          if (!proj) return;
          const [px, py] = proj;
          if (Math.hypot(mx - px, my - py) < 14) found = idx;
        });
        return found;
      }

      const onEnter = () => { S.isHovering = true; };
      const onLeave = () => { S.isHovering = false; S.hovered = null; setTooltip(''); };
      const onMove  = (e) => {
        if (S.isDragging) {
          S.rotate[0] += (e.clientX - S.lastX) * 0.35;
          S.lastX = e.clientX;
          projection.rotate(S.rotate);
          S.hovered = null; setTooltip('');
          return;
        }
        const [mx, my] = toCanvas(e);
        const h = getHovered(mx, my);
        S.hovered = h;
        setTooltip(h !== null ? `${suppliers[h].region} · ${suppliers[h].label}` : '');
      };
      const onDown  = (e) => { S.isDragging = true;  S.lastX = e.clientX; };
      const onUp    = ()  => { S.isDragging = false; };

      const onTouchStart = (e) => { S.lastX = e.touches[0].clientX; };
      const onTouchMove = (e) => {
        const dx = e.touches[0].clientX - S.lastX;
        const dy = e.touches[0].clientY - (S.lastY ?? e.touches[0].clientY);
        if (Math.abs(dx) < Math.abs(dy)) return; // scroll vertical → on laisse passer
        e.preventDefault();
        S.rotate[0] += dx * 0.35;
        S.lastX = e.touches[0].clientX;
        S.lastY = e.touches[0].clientY;
        projection.rotate(S.rotate);
      };

      canvas.addEventListener('mouseenter',  onEnter);
      canvas.addEventListener('mouseleave',  onLeave);
      canvas.addEventListener('mousemove',   onMove);
      canvas.addEventListener('mousedown',   onDown);
      window.addEventListener('mouseup',     onUp);
      canvas.addEventListener('touchstart',  onTouchStart, { passive: true });
      canvas.addEventListener('touchmove',   onTouchMove,  { passive: false });

      // Cleanup stocké dans stateRef pour le return du useEffect
      S.cleanup = () => {
        cancelAnimationFrame(S.raf);
        canvas.removeEventListener('mouseenter',  onEnter);
        canvas.removeEventListener('mouseleave',  onLeave);
        canvas.removeEventListener('mousemove',   onMove);
        canvas.removeEventListener('mousedown',   onDown);
        window.removeEventListener('mouseup',     onUp);
        canvas.removeEventListener('touchstart',  onTouchStart);
        canvas.removeEventListener('touchmove',   onTouchMove);
      };
    }

    init().catch(console.error);

    return () => {
      cancelled = true;
      const S = stateRef.current;
      if (S.raf)     cancelAnimationFrame(S.raf);
      if (S.cleanup) S.cleanup();
    };
  }, [suppliers]);

  return (
    <div className={styles.wrapper}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={300}
        height={300}
        aria-label="Globe interactif — réseau de fournisseurs Afrique, Europe, Asie"
      />
      <div className={styles.tooltip}>{tooltip || '\u00a0'}</div>
      <div className={styles.legend}>
        {LEGEND.map((l) => (
          <div key={l.region} className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: l.color }} />
            {l.region}
          </div>
        ))}
      </div>
      <p className={styles.hint}>Survolez ou faites glisser</p>
    </div>
  );
}
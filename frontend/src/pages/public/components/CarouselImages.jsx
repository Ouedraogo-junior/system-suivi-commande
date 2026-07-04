// src/pages/public/components/CarouselImages.jsx
import { useState, useEffect, useRef } from 'react';
import styles from './CarouselImages.module.css';

const SLIDES = [
  { id: 1, label: 'Imprimerie' },
  { id: 2, label: 'Informatique' },
  { id: 3, label: 'Négoce' },
  { id: 4, label: 'Aménagement' },
];

const SWIPE_THRESHOLD_RATIO = 0.18; // % de la largeur à franchir pour changer de slide

export default function CarouselImages({ autoPlay = true, interval = 3000, slides, fit = 'cover', aspectRatio = '4 / 3' }) {
  const ITEMS = slides ?? SLIDES;
  const [current, setCurrent] = useState(0);

  const containerRef = useRef(null);
  const trackRef     = useRef(null);
  const S = useRef({
    startX: 0,
    startY: 0,
    direction: null, // 'h' | 'v' | null
    dx: 0,
    width: 0,
    dragging: false,
  }).current;

  // ── Autoplay — en pause pendant un drag ──
  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      if (S.dragging) return;
      setCurrent(i => (i + 1) % ITEMS.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, ITEMS.length]);

  // ── Resynchronise le track à sa position figée après tout changement de `current` ──
  useEffect(() => {
    const track = trackRef.current;
    if (!track || S.dragging) return;
    track.style.transition = '';
    track.style.transform = `translateX(-${current * 100}%)`;
  }, [current]);

  // ── Swipe tactile ──
  useEffect(() => {
    const el    = containerRef.current;
    const track = trackRef.current;
    if (!el || !track) return;

    const onTouchStart = (e) => {
      S.startX   = e.touches[0].clientX;
      S.startY   = e.touches[0].clientY;
      S.direction = null;
      S.dx       = 0;
      S.width    = el.offsetWidth;
      S.dragging = true;
    };

    const onTouchMove = (e) => {
      const dx = e.touches[0].clientX - S.startX;
      const dy = e.touches[0].clientY - S.startY;

      if (S.direction === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return; // pas encore assez de mouvement pour trancher
        S.direction = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        if (S.direction === 'h') track.style.transition = 'none'; // suivi direct du doigt
      }

      if (S.direction === 'v') return; // scroll vertical natif — on ne touche à rien, pas de preventDefault

      e.preventDefault(); // swipe horizontal confirmé, on prend la main sur le geste
      S.dx = dx;
      track.style.transform = `translateX(calc(-${current * 100}% + ${dx}px))`;
    };

    const onTouchEnd = () => {
      S.dragging = false;
      track.style.transition = '';

      if (S.direction === 'h') {
        const threshold = S.width * SWIPE_THRESHOLD_RATIO;
        if (S.dx <= -threshold) {
          setCurrent(i => (i + 1) % ITEMS.length);
        } else if (S.dx >= threshold) {
          setCurrent(i => (i - 1 + ITEMS.length) % ITEMS.length);
        } else {
          track.style.transform = `translateX(-${current * 100}%)`; // retour élastique
        }
      }
      S.direction = null;
      S.dx = 0;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false }); // false requis pour preventDefault conditionnel
    el.addEventListener('touchend',   onTouchEnd,   { passive: true });
    el.addEventListener('touchcancel',onTouchEnd,   { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
      el.removeEventListener('touchcancel',onTouchEnd);
    };
  }, [current, ITEMS.length]);

  return (
    <div className={styles.carousel} style={{ aspectRatio }} ref={containerRef}>
      <div
        className={styles.track}
        ref={trackRef}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {ITEMS.map((slide, idx) => (
          <div key={slide.id ?? idx} className={styles.slide}>
            {slide.src ? (
              <img
                src={slide.src}
                alt={slide.alt}
                className={`${styles.slideImg} ${fit === 'contain' ? styles.slideImgContain : ''}`}
                draggable={false}
              />
            ) : (
              <div className={styles.placeholder}>
                <div className={styles.placeholderIcon}>
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                </div>
                <div className={styles.placeholderLabel}>{slide.label}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {ITEMS.map((_, i) => (
          <button key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)} />
        ))}
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => setCurrent(i => (i - 1 + ITEMS.length) % ITEMS.length)}>‹</button>
      <button className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => setCurrent(i => (i + 1) % ITEMS.length)}>›</button>
    </div>
  );
}
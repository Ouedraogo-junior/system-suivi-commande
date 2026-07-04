// src/pages/public/components/CarouselPartenaires.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './CarouselPartenaires.module.css';

const DESKTOP_PER_SLIDE = 3; // logos visibles par slide sur desktop
const MOBILE_BREAKPOINT = 640;

export default function CarouselPartenaires({ items = [], autoPlay = true, interval = 3500, theme = 'light' }) {
  const [perSlide, setPerSlide]   = useState(DESKTOP_PER_SLIDE);
  const [current,  setCurrent]    = useState(0);
  const touchStartX               = useRef(null);
  const containerRef              = useRef(null);

  // Détecte la largeur du conteneur pour adapter perSlide
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(([entry]) => {
      setPerSlide(entry.contentRect.width < MOBILE_BREAKPOINT ? 1 : DESKTOP_PER_SLIDE);
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const count = items.length;
  // Nombre de slides = pages de `perSlide` logos
  const slideCount = Math.ceil(count / perSlide);

  const next = useCallback(() => setCurrent(i => (i + 1) % slideCount), [slideCount]);
  const prev = useCallback(() => setCurrent(i => (i - 1 + slideCount) % slideCount), [slideCount]);

  // Autoplay
  useEffect(() => {
    if (!autoPlay || slideCount <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slideCount, next]);

  // Reset si perSlide change et current dépasse
  useEffect(() => {
    setCurrent(i => Math.min(i, slideCount - 1));
  }, [slideCount]);

  // Touch swipe
  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  }

  if (count === 0) return null;

  // Groupes de logos par slide
  const slides = Array.from({ length: slideCount }, (_, si) =>
    items.slice(si * perSlide, si * perSlide + perSlide)
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.carousel} ${theme === 'dark' ? styles.dark : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={styles.track}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((group, si) => (
          <div key={si} className={styles.slide}>
            {group.map((p, li) => (
              <div key={li} className={styles.logoCell}>
                {p.src ? (
  <>
    <div className={styles.logoImgBox}>
      <img src={p.src} alt={p.alt} className={styles.logo} />
    </div>
    <span className={styles.partnerName}>{p.alt}</span>
  </>
) : (
  <div className={styles.placeholder}>
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
    <span className={styles.placeholderLabel}>{p.alt}</span>
  </div>
)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Dots */}
      {slideCount > 1 && (
        <div className={styles.dots}>
          {slides.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Flèches — seulement si plusieurs slides */}
      {slideCount > 1 && (
        <>
          <button className={`${styles.arrow} ${styles.arrowLeft}`}  onClick={prev} aria-label="Précédent">‹</button>
          <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Suivant">›</button>
        </>
      )}
    </div>
  );
}
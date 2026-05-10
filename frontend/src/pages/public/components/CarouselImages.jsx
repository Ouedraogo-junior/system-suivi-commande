// src/pages/public/components/CarouselImages.jsx
import { useState, useEffect } from 'react';
import styles from './CarouselImages.module.css';

// Placeholders — remplacer par les vraies images
const SLIDES = [
  { id: 1, label: 'Imprimerie' },
  { id: 2, label: 'Informatique' },
  { id: 3, label: 'Négoce' },
  { id: 4, label: 'Aménagement' },
];

export default function CarouselImages({ autoPlay = true, interval = 3000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % SLIDES.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval]);

  return (
    <div className={styles.carousel}>
      <div className={styles.track} style={{ transform: `translateX(-${current * 100}%)` }}>
        {SLIDES.map(slide => (
          <div key={slide.id} className={styles.slide}>
            {/* Remplacer ce div par <img src="..." alt="..." /> */}
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
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => setCurrent(i => (i - 1 + SLIDES.length) % SLIDES.length)}>‹</button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => setCurrent(i => (i + 1) % SLIDES.length)}>›</button>
    </div>
  );
}
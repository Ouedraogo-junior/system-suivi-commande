// src/pages/public/components/CarouselPartenaires.jsx
import { useState, useEffect } from 'react';
import styles from './CarouselPartenaires.module.css';

export default function CarouselPartenaires({ items = [], autoPlay = true, interval = 3000 }) {
  const [current, setCurrent] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (!autoPlay || count === 0) return;
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % count);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, count]);

  if (count === 0) return null;

  return (
    <div className={styles.carousel}>
      <div
        className={styles.track}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((p, i) => (
          <div key={i} className={styles.slide}>
            {p.src
              ? <img src={p.src} alt={p.alt} className={styles.logo} />
              : (
                <div className={styles.placeholder}>
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span className={styles.placeholderLabel}>{p.alt}</span>
                </div>
              )
            }
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => setCurrent(i => (i - 1 + count) % count)}
      >‹</button>
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => setCurrent(i => (i + 1) % count)}
      >›</button>
    </div>
  );
}
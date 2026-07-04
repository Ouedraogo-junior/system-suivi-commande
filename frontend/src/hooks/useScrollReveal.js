// src/hooks/useScrollReveal.js
import { useEffect } from 'react';

export function useScrollReveal(doneClass = 'revealed') {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            requestAnimationFrame(() => {
              entry.target.classList.add(doneClass);
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: '-8% 0px -5% 0px' }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [doneClass]);
}
// src/pages/public/AccueilPage.jsx
import { Link }              from 'react-router-dom';
import { useEffect, useRef } from 'react';
import CarouselImages        from './components/CarouselImages';
import { ACCUEIL_CONTENT }   from './data/accueil.data';
import styles                from './AccueilPage.module.css';

// ─── Fichier d'animations séparé (importé en global, pas en module)
import './AccueilPage.animations.css';

import CarouselPartenaires   from './components/CarouselPartenaires';
import DomainesWheel         from './components/DomainesWheel';
import FournGlobe from './components/FournGlobe';

// ─── Icônes SVG inline ───────────────────────────────────────
const Icons = {
  print: <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 17H7V7h10v10zM7 7L5 5M17 7l2-2M17 17l2 2M7 17l-2 2"/></svg>,
  pc:    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  world: <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  home:  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

const SVC_ICONS  = [Icons.print, Icons.pc, Icons.world, Icons.home];
const SVC_COLORS = ['var(--green-dark)', 'var(--brown)', 'var(--brown)', 'var(--green-dark)'];


// ─── Hook : scroll-reveal avec Intersection Observer ─────────
//
// Changements clés vs version précédente :
//  • threshold: 0.12  → l'élément doit être visible à 12% avant de déclencher
//  • rootMargin: '-8% 0px -5% 0px'  → marges réduites pour déclencher plus tôt
//  • Pas de timer retardé — on observe immédiatement mais le rootMargin
//    empêche les faux positifs au chargement
//
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');   // classe globale, pas CSS module
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold:  0.12,                    // 12% visible = déclenche
        rootMargin: '-8% 0px -5% 0px',      // ni trop tôt, ni trop tard
      }
    );

    // Délai minimal (60ms) juste pour laisser le layout se stabiliser
    // sans masquer les animations aux utilisateurs qui scrollent vite
    const timer = setTimeout(() => {
      els.forEach((el) => observer.observe(el));
    }, 60);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}


// ─── Hook : compteur animé ────────────────────────────────────
function useCountUp(ref, end, duration = 1800) {
  useEffect(() => {
    if (!ref.current) return;
    const el     = ref.current;
    const raw    = el.dataset.target || '0';
    const suffix = raw.replace(/[\d.]/g, '');
    const target = parseFloat(raw);
    let start   = null;
    let started = false;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // ease-out quart — plus marqué que cubic
      const eased = 1 - Math.pow(1 - progress, 4);
      const val   = Math.round(eased * target);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, end, duration]);
}


// ─── Composant stat individuel ────────────────────────────────
function StatCounter({ num, lbl }) {
  const ref = useRef(null);
  useCountUp(ref, num, 1800);
  return (
    <div className={styles.statItem}>
      <div className={styles.statNum} ref={ref} data-target={num}>0</div>
      <div className={styles.statLbl}>{lbl}</div>
    </div>
  );
}


// ─── Page ────────────────────────────────────────────────────
export default function AccueilPage({ lang }) {
  const t = ACCUEIL_CONTENT[lang];
  useScrollReveal();

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBgShape}  aria-hidden="true" />
        <div className={styles.heroBgShape2} aria-hidden="true" />
        <div className={styles.heroBgOrb}    aria-hidden="true" />
        <div className={styles.heroBgOrb2}   aria-hidden="true" />
        <div className={styles.heroDotGrid}  aria-hidden="true" />

        <div className={styles.heroContent}>
          {/* Les classes heroAnimateX sont définies dans animations.css (global) */}
          <div className={`${styles.heroBadge} heroAnimate1`}>{t.heroBadge}</div>
          <h1 className={`${styles.heroTitle} heroAnimate2`}>
            {t.heroTitle[0]}<br />{t.heroTitle[1]}<br />
            <span className={styles.heroSpan}>{t.heroSpan}</span>
          </h1>
          <p className={`${styles.heroSub} heroAnimate3`}>{t.heroSub}</p>
          <div className={`${styles.heroBtns} heroAnimate4`}>
            <Link to="/services" className={styles.btnPrimary}>{t.heroBtnPrimary}</Link>
            <Link to="/contact"  className={styles.btnOutline}>{t.heroBtnOutline}</Link>
          </div>
          <div className={`${styles.heroStats} heroAnimate5`}>
            {t.stats.map((s, i) => (
              <StatCounter key={i} num={s.num} lbl={s.lbl} />
            ))}
          </div>
        </div>

        <div className={`${styles.heroVisual} heroAnimate4`}>
          <DomainesWheel domaines={t.domaines} title={t.heroDomainesTitle} />
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section className={styles.about}>
        {/*
          Les classes revealLeft / revealRight sont dans animations.css (global).
          Le data-reveal déclenche l'ajout de .revealed via useScrollReveal.
        */}
        <div className={`${styles.aboutLeft} revealLeft`} data-reveal>
          <div className={styles.sectionLabel}>{t.aboutLabel}</div>
          <h2 className={styles.sectionTitle}>{t.aboutTitle}</h2>
          <p className={styles.sectionBody}>{t.aboutBody}</p>
          <Link to="/apropos" className={styles.sectionLink}>{t.aboutLink}</Link>
        </div>
        <div className={`${styles.aboutPartenaires} revealRight`} data-reveal>
          <div className={styles.aboutPartenairesLabel}>{t.partenairesLabel}</div>
          <CarouselPartenaires items={t.partenaires} />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={styles.services}>
        <div className={`${styles.servicesLeft} revealUp`} data-reveal>
          <div className={styles.sectionLabel}>{t.servicesLabel}</div>
          <h2 className={styles.sectionTitle}>{t.servicesTitle}</h2>
          <div className={styles.servicesGrid}>
            {t.services.map((svc, i) => (
              <div key={i} className={`${styles.svcCard} svcCardAnim`}
                   style={{ '--svc-delay': `${i * 0.1}s` }}>
                <div className={styles.svcCardHead} style={{ background: SVC_COLORS[i] }}>
                  <div className={styles.svcCardHeadIcon}>{SVC_ICONS[i]}</div>
                  <div className={styles.svcCardTitle}>{svc.title}</div>
                </div>
                <div className={styles.svcCardBody}>
                  {svc.items.map((item, j) => (
                    <div key={j} className={styles.svcItem}>
                      <div className={styles.svcDot} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link to="/public/services" className={styles.sectionLink}>{t.servicesLink}</Link>
        </div>
        <div className={`${styles.servicesRight} revealRight`} data-reveal>
          <div className={styles.srCarouselTitle}>{t.servicesRight.carouselTitle}</div>
          <CarouselImages />
        </div>
      </section>

      {/* ── ASSOCIATIONS ── */}
      <section className={styles.assoc}>
        <div className={`${styles.assocInner} revealUp`} data-reveal>
          <div className={styles.sectionLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>{t.assocLabel}</div>
          <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>{t.assocTitle}</h2>
          <p className={styles.sectionBody} style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '620px' }}>{t.assocBody}</p>
          <div className={styles.assocCards}>
            {t.assocItems.map((item, i) => (
              <div key={i} className={`${styles.assocCard} assocCardAnim`}
                   style={{ '--assoc-delay': `${i * 0.14}s` }}>
                <div className={styles.assocCardNum}>{item.num}</div>
                <div className={styles.assocCardLabel}>{item.label}</div>
                <div className={styles.assocCardSub}>{item.sub}</div>
              </div>
            ))}
          </div>
          <Link to="/apropos" className={styles.assocLink}>{t.assocLink}</Link>
        </div>
      </section>

      {/* ── FOURNISSEURS ── */}
      <section className={styles.fourn}>
        <div className={`${styles.fournLeft} revealLeft`} data-reveal>
          <div className={styles.sectionLabel}>{t.fournLabel}</div>
          <h2 className={styles.sectionTitle}>{t.fournTitle}</h2>
          <p className={styles.sectionBody}>{t.fournBody}</p>
          <div className={styles.fournRegions}>
            {t.fournRegions.map((r, i) => (
              <div
                key={i}
                className={`${styles.fournRegionCard} fournRegionAnim`}
                style={{ '--fourn-delay': `${i * 0.12}s` }}
              >
                <div className={styles.fournRegionName}>{r.region}</div>
                <div className={styles.fournRegionDesc}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      
        {/* Globe interactif — remplace le placeholder */}
        <div className={`${styles.fournRight} revealRight`} data-reveal>
          <FournGlobe />
        </div>
      </section>
    </div>
  );
}
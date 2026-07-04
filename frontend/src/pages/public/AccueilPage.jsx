// src/pages/public/AccueilPage.jsx
import { Link }              from 'react-router-dom';
import { useEffect, useRef } from 'react';
import CarouselImages        from './components/CarouselImages';
import { ACCUEIL_CONTENT }   from './data/accueil.data';
import styles                from './AccueilPage.module.css';

import './AccueilPage.animations.css';

import DomainesWheel from './components/DomainesWheel';
import FournGlobe    from './components/FournGlobe';
import LogoAssembly  from './components/LogoAssembly';

// ─── Icônes SVG inline ───────────────────────────────────────
const Icons = {
  print: <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 17H7V7h10v10zM7 7L5 5M17 7l2-2M17 17l2 2M7 17l-2 2"/></svg>,
  pc:    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  world: <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  home:  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

const SVC_ICONS  = [Icons.print, Icons.pc, Icons.world, Icons.home];
const SVC_COLORS = ['var(--green-dark)', 'var(--brown)', 'var(--brown)', 'var(--green-dark)'];


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
  const isNumeric = !isNaN(parseFloat(num)) && isFinite(num.toString().replace(/[^0-9.-]/g, ''));

  useCountUp(isNumeric ? ref : { current: null }, num, 1800);

  return (
    <div className={styles.statItem}>
      <div className={styles.statNum} ref={isNumeric ? ref : null} data-target={num}>
        {isNumeric ? '0' : num}
      </div>
      <div className={styles.statLbl}>{lbl}</div>
    </div>
  );
}


// ─── Page ────────────────────────────────────────────────────
export default function AccueilPage({ lang }) {
  const t = ACCUEIL_CONTENT[lang];

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
            <div style={{ width: '100%', '--logo-width': '70%', '--logo-cap': '1000px' }}>
        <LogoAssembly />
      </div>

      <section className={styles.hero}>
        <div className={styles.heroBgShape}  aria-hidden="true" />
        <div className={styles.heroBgShape2} aria-hidden="true" />
        <div className={styles.heroBgOrb}    aria-hidden="true" />
        <div className={styles.heroBgOrb2}   aria-hidden="true" />
        <div className={styles.heroDotGrid}  aria-hidden="true" />

        <div className={styles.heroContent}>
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
        <div className={styles.aboutLeft}>
          <div className={styles.sectionLabel}>{t.aboutLabel}</div>
          <h2 className={styles.sectionTitle}>{t.aboutTitle}</h2>
          <p className={styles.sectionBody}>{t.aboutBody}</p>
          <Link to="/apropos" className={styles.sectionLink}>{t.aboutLink}</Link>
        </div>
        <div className={styles.aboutPartenaires}>
          <div className={styles.aboutPartenairesLabel}>{t.partenairesLabel}</div>
          <CarouselImages
            slides={t.partenaires.map((p, i) => ({ id: i, label: p.alt, src: p.src, alt: p.alt }))}
            fit="contain"
            aspectRatio="1 / 1"
          />
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className={styles.services}>
        <div className={styles.servicesLeft}>
          <div className={styles.sectionLabel}>{t.servicesLabel}</div>
          <h2 className={styles.sectionTitle}>{t.servicesTitle}</h2>
          <div className={styles.servicesGrid}>
            {t.services.map((svc, i) => (
              <div key={i} className={styles.svcCard}>
                <div className={styles.svcCardHead} style={{ background: SVC_COLORS[i] }}>
                  {svc.img && (
                    <img src={svc.img} alt={svc.title} className={styles.svcCardImg} />
                  )}
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
          <Link to="/services" className={styles.sectionLink}>{t.servicesLink}</Link>
        </div>
        <div className={styles.servicesRight}>
          <div className={styles.srCarouselTitle}>{t.servicesRight.carouselTitle}</div>
          <CarouselImages slides={t.servicesRight.slides} />
        </div>
      </section>

      {/* ── ASSOCIATIONS ── */}
      <section className={styles.assoc}>
        <div className={styles.assocInner}>
          <div className={styles.sectionLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>{t.assocLabel}</div>
          <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>{t.assocTitle}</h2>
          <p className={styles.sectionBody} style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '620px' }}>{t.assocBody}</p>
          <div className={styles.assocCarousel}>
            <CarouselImages
              slides={t.assocItems.map((p, i) => ({ id: i, label: p.alt, src: p.src, alt: p.alt }))}
              fit="contain"
              aspectRatio="1 / 1"
            />
          </div>
          <Link to="/apropos" className={styles.assocLink}>{t.assocLink}</Link>
        </div>
      </section>

      {/* ── FOURNISSEURS ── */}
      <section className={styles.fourn}>
        <div className={styles.fournLeft}>
          <div className={styles.sectionLabel}>{t.fournLabel}</div>
          <h2 className={styles.sectionTitle}>{t.fournTitle}</h2>
          <p className={styles.sectionBody}>{t.fournBody}</p>
          <div className={styles.fournRegions}>
            {t.fournRegions.map((r, i) => (
              <div key={i} className={styles.fournRegionCard}>
                <div className={styles.fournRegionName}>{r.region}</div>
                <div className={styles.fournRegionDesc}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.fournRight}>
          <FournGlobe />
        </div>
      </section>
    </div>
  );
}
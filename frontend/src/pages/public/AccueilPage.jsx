// src/pages/public/AccueilPage.jsx
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import CarouselImages        from './components/CarouselImages';
import { ACCUEIL_CONTENT }   from './data/accueil.data';
import styles                from './AccueilPage.module.css';
import CarouselPartenaires from './components/CarouselPartenaires';


// ─── Icônes SVG inline ───────────────────────────────────────
const Icons = {
  print: <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17 17H7V7h10v10zM7 7L5 5M17 7l2-2M17 17l2 2M7 17l-2 2"/></svg>,
  pc:    <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  world: <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  home:  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

const SVC_ICONS  = [Icons.print, Icons.pc, Icons.world, Icons.home];
const SVC_COLORS = ['var(--green-dark)', 'var(--brown)', 'var(--brown)', 'var(--green-dark)'];

// ─── Page ────────────────────────────────────────────────────
export default function AccueilPage({ lang }) {
  const t = ACCUEIL_CONTENT[lang];

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroBgShape} />
        <div className={styles.heroBgShape2} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>{t.heroBadge}</div>
          <h1 className={styles.heroTitle}>
            {t.heroTitle[0]}<br />{t.heroTitle[1]}<br />
            <span className={styles.heroSpan}>{t.heroSpan}</span>
          </h1>
          <p className={styles.heroSub}>{t.heroSub}</p>
          <div className={styles.heroBtns}>
            <Link to="/public/services" className={styles.btnPrimary}>{t.heroBtnPrimary}</Link>
            <Link to="/public/contact"  className={styles.btnOutline}>{t.heroBtnOutline}</Link>
          </div>
          <div className={styles.heroStats}>
            {t.stats.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLbl}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroVisualTitle}>{t.heroDomainesTitle}</div>
          {t.domaines.map((d, i) => (
            <div key={i} className={styles.servicePill}>
              <div className={styles.pillDot} />
              {d}
            </div>
          ))}
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section className={styles.about}>
        <div className={styles.aboutLeft}>
          <div className={styles.sectionLabel}>{t.aboutLabel}</div>
          <h2 className={styles.sectionTitle}>{t.aboutTitle}</h2>
          <p className={styles.sectionBody}>{t.aboutBody}</p>
          <Link to="/public/apropos" className={styles.sectionLink}>{t.aboutLink}</Link>
        </div>
        <div className={styles.aboutPartenaires}>
            <div className={styles.aboutPartenairesLabel}>{t.partenairesLabel}</div>
            <CarouselPartenaires items={t.partenaires} />
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
        <div className={styles.servicesRight}>
          <div className={styles.srCarouselTitle}>{t.servicesRight.carouselTitle}</div>
          <CarouselImages />
        </div>
      </section>

      {/* ── ASSOCIATIONS ── */}
      <section className={styles.assoc}>
        <div className={styles.assocInner}>
          <div className={styles.sectionLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>{t.assocLabel}</div>
          <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>{t.assocTitle}</h2>
          <p className={styles.sectionBody} style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '620px' }}>{t.assocBody}</p>
          <div className={styles.assocCards}>
            {t.assocItems.map((item, i) => (
              <div key={i} className={styles.assocCard}>
                <div className={styles.assocCardNum}>{item.num}</div>
                <div className={styles.assocCardLabel}>{item.label}</div>
                <div className={styles.assocCardSub}>{item.sub}</div>
              </div>
            ))}
          </div>
          <Link to="/public/apropos" className={styles.assocLink}>{t.assocLink}</Link>
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
          <div className={styles.fournMapPlaceholder}>
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24" style={{ color: 'var(--green-dark)', opacity: 0.4 }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
            <span>Carte du réseau</span>
            <span style={{ fontSize: '11px', opacity: 0.6 }}>À intégrer</span>
          </div>
        </div>
      </section>

    </div>
  );
}
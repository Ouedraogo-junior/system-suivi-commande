// src/pages/public/ServicesPage.jsx
import { useState, useEffect }                            from 'react';
import { Link, useOutletContext, useLocation }            from 'react-router-dom';
import { SERVICES_CONTENT, GALERIE_ITEMS, DOMAIN_COLORS } from './data/services.data';
import HeroServices                                       from './components/services/HeroServices';
import DomaineSection                                     from './components/services/DomaineSection';
import GalerieServices                                    from './components/services/GalerieServices';
import styles                                             from './ServicesPage.module.css';
import './ServicesPage.animations.css';
import { useScrollReveal } from '../../hooks/useScrollReveal';

// IDs dans le même ordre que les domaines
const DOMAIN_IDS = ['imprimerie', 'informatique', 'negoce', 'amenagement'];

// ─── Icônes ──────────────────────────────────────────────────
const DOMAIN_ICONS = [
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
];

const IconArrow = <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>;

// ─── Page ────────────────────────────────────────────────────
export default function ServicesPage() {
  const { lang } = useOutletContext();
  const t = SERVICES_CONTENT[lang];
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  useScrollReveal();

  // Scroll vers la section ciblée par le hash (venant de la roue ou d'un lien direct)
  useEffect(() => {
    if (!location.hash) return;

    const id    = location.hash.replace('#', '');
    const index = DOMAIN_IDS.indexOf(id);

    // Petit délai pour laisser le DOM se peindre
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (index !== -1) setActiveTab(index);
      }
    }, 120);

    return () => clearTimeout(t);
  }, [location.hash]);

  function handleTabClick(index, id) {
    setActiveTab(index);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className={styles.page}>
      <HeroServices
        t={t}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        domainIcons={DOMAIN_ICONS}
        onTabClick={handleTabClick}
      />

      {t.domaines.map((d, i) => (
        <DomaineSection
          key={d.id}
          domaine={d}
          index={i}
          icon={DOMAIN_ICONS[i]}
          color={DOMAIN_COLORS[i]}
          lang={lang}
        />
      ))}

      <GalerieServices t={t} items={GALERIE_ITEMS} lang={lang} />

      {/* ── CTA ── */}
      <section className={`${styles.cta} revealUp`} data-reveal>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{t.ctaTitle}</h2>
          <p className={styles.ctaSub}>{t.ctaSub}</p>
          <Link to="/contact" className={styles.ctaBtn}>
            {t.ctaBtn}
            <span className={styles.ctaBtnArrow}>{IconArrow}</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
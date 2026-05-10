// src/pages/public/AProposPage.jsx
import { useOutletContext } from 'react-router-dom';
import { APROPOS_CONTENT } from './data/apropos.data';
import HeroAPropos          from './components/apropos/HeroAPropos';
import Histoire             from './components/apropos/Histoire';
import Valeurs              from './components/apropos/Valeurs';
import Partenaires          from './components/apropos/Partenaires';
import ReseauFournisseurs   from './components/apropos/ReseauFournisseurs';
import EngagementAssociatif from './components/apropos/EngagementAssociatif';
import { Link }             from 'react-router-dom';
import styles               from './AProposPage.module.css';

export default function AProposPage() {
  const { lang } = useOutletContext();
  const t = APROPOS_CONTENT[lang];

  return (
    <div className={styles.page}>
      <HeroAPropos          t={t} lang={lang} />
      <Histoire             t={t} />
      <Valeurs              t={t} />
      <Partenaires          t={t} />
      <EngagementAssociatif t={t} />
      <ReseauFournisseurs   t={t} />

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>{t.cta.title}</h2>
        <p  className={styles.ctaSub}>{t.cta.sub}</p>
        <Link to="/public/contact" className={styles.ctaBtn}>{t.cta.btn}</Link>
      </section>
    </div>
  );
}
// src/pages/public/components/apropos/HeroAPropos.jsx
import { Link } from 'react-router-dom';
import styles from './AProposComponents.module.css';
import './AProposPage.animations.css';

export default function HeroAPropos({ t, lang }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBgShape} />
      <div className={styles.heroBgShape2} />
      <div className={styles.heroInner}>
       <div className={`${styles.breadcrumb}  aproposHeroAnimate1`}>
          <Link to="/" className={styles.breadcrumbLink}>{t.breadcrumbHome}</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{t.pageLabel}</span>
        </div>
        <div className={`${styles.heroLabel} aproposHeroAnimate2`}>{t.hero.label}</div>
        <h1 className={`${styles.heroTitle} aproposHeroAnimate3`}>{t.hero.title}</h1>
        <p className={`${styles.heroSub} aproposHeroAnimate4`}>{t.hero.sub}</p>
      </div>
    </section>
  );
}
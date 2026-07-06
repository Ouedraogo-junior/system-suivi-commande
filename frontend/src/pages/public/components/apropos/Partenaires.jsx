// src/pages/public/components/apropos/Partenaires.jsx
import CarouselImages from '../CarouselImages';
import styles from './AProposComponents.module.css';

export default function Partenaires({ t }) {
  const p = t.partenaires;
  const items = p.items;
  const slides = items.map((item, i) => ({
    id: i,
    label: item.alt,
    src: item.src,
    alt: item.alt,
  }));

  return (
    <section className={`${styles.partenaires} revealUp`} data-reveal>
      <div className={styles.partenairesLayout}>
        <div className={styles.partenairesHeader}>
          <div className={styles.sectionLabel}>{p.label}</div>
          <h2 className={styles.sectionTitle}>{p.title}</h2>
          <p className={styles.sectionBody}>{p.body}</p>
        </div>

        <div className={styles.partCarousel}>
          <CarouselImages slides={slides} fit="contain" aspectRatio="1 / 1" />
        </div>
      </div>
    </section>
  );
}
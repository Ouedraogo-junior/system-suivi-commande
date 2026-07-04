import styles from './AProposComponents.module.css';
// import CarouselPartenaires from '../CarouselPartenaires';
import CarouselImages from '../CarouselImages';

export default function EngagementAssociatif({ t }) {
  const e = t.engagement;
  return (
    <section className={`${styles.engagement} revealUp`} data-reveal>
      <div className={styles.engagementInner}>
        <div className={styles.engagementLayout}>
          <div className={styles.engagementText}>
            <div className={styles.sectionLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>{e.label}</div>
            <h2 className={styles.sectionTitle} style={{ color: '#fff' }}>{e.title}</h2>
            <p className={styles.sectionBody} style={{ color: 'rgba(255,255,255,0.7)' }}>{e.body}</p>
          </div>
          <div className={styles.engagementCarousel}>
            <CarouselImages
              slides={e.associations.map((a, i) => ({ id: i, label: a.alt, src: a.src, alt: a.alt }))}
              fit="contain"
              aspectRatio="1 / 1"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
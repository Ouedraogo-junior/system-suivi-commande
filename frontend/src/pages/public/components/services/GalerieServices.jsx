// src/pages/public/components/services/GalerieServices.jsx
import styles from './ServicesComponents.module.css';

const Icons = {
  img:   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  play:  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  playS: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  imgS:  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
};

function GalItem({ item, lang }) {
  const caption = lang === 'fr' ? item.captionFr : item.captionEn;

  return (
    <div className={styles.galItem}>
      <div className={styles.galMedia}>
        {item.type === 'video' ? (
          item.src ? (
            <video className={styles.galVideo} src={item.src} controls preload="metadata" playsInline />
          ) : (
            <div className={`${styles.galPlaceholder} ${styles.galPlaceholderVideo}`}>
              <div className={styles.galPlayIcon}>{Icons.play}</div>
              <span>{lang === 'fr' ? 'Vidéo à intégrer' : 'Video to add'}</span>
            </div>
          )
        ) : (
          item.src ? (
            <img src={item.src} alt={caption} className={styles.galImg} loading="lazy" />
          ) : (
            <div className={styles.galPlaceholder}>
              {Icons.img}
              <span>{lang === 'fr' ? 'Photo à intégrer' : 'Photo to add'}</span>
            </div>
          )
        )}
        <div className={`${styles.galBadge} ${item.type === 'video' ? styles.galBadgeVideo : styles.galBadgePhoto}`}>
          {item.type === 'video' ? Icons.playS : Icons.imgS}
          <span>{item.type === 'video' ? (lang === 'fr' ? 'Vidéo' : 'Video') : (lang === 'fr' ? 'Photo' : 'Photo')}</span>
        </div>
      </div>
      {caption && <div className={styles.galCaption}>{caption}</div>}
    </div>
  );
}

export default function GalerieServices({ t, items, lang }) {
  return (
    <section className={styles.galerie}>
      <div className={styles.galerieHeader}>
        <div className={styles.sectionLabel}>{t.galTitle}</div>
        <h2 className={styles.sectionTitle}>{t.galSub}</h2>
        <div className={styles.galLegend}>
          <span className={styles.galLegendItem}>
            <span className={`${styles.galLegendDot} ${styles.galLegendDotPhoto}`} />
            {t.galPhotoLabel}
          </span>
          <span className={styles.galLegendItem}>
            <span className={`${styles.galLegendDot} ${styles.galLegendDotVideo}`} />
            {t.galVideoLabel}
          </span>
        </div>
      </div>
      <div className={styles.galerieGrid}>
        {items.map((item, i) => (
          <GalItem key={i} item={item} lang={lang} />
        ))}
      </div>
    </section>
  );
}
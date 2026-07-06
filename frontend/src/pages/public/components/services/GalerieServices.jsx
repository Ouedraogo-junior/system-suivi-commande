import { useState, useRef, useEffect } from 'react';
import styles from './ServicesComponents.module.css';

const Icons = {
  img:   <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  play:  <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  playS: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>,
  imgS:  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  close: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
};

// ── Lightbox vidéo : adapte l'orientation réelle au clic ──
function VideoLightbox({ src, caption, onClose }) {
  const videoRef = useRef(null);
  const [orientation, setOrientation] = useState('landscape');

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (v && v.videoHeight > v.videoWidth) setOrientation('portrait');
    else setOrientation('landscape');
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className={styles.lightboxOverlay} onClick={onClose}>
      <div
        className={`${styles.lightboxBox} ${orientation === 'portrait' ? styles.lightboxPortrait : styles.lightboxLandscape}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.lightboxClose} onClick={onClose}>{Icons.close}</button>
        <video
          ref={videoRef}
          className={styles.lightboxVideo}
          src={src}
          controls
          autoPlay
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
        />
        {caption && <div className={styles.lightboxCaption}>{caption}</div>}
      </div>
    </div>
  );
}

function GalItem({ item, lang, onOpenVideo }) {
  const caption = lang === 'fr' ? item.captionFr : item.captionEn;

  return (
    <div className={styles.galItem}>
      <div className={styles.galMedia}>
        {item.type === 'video' ? (
          item.src ? (
            <div
              className={styles.galVideoThumbWrap}
              onClick={() => onOpenVideo(item.src, caption)}
            >
              <video className={styles.galVideo} src={item.src} preload="metadata" muted playsInline />
              <div className={styles.galPlayOverlay}>
                <div className={styles.galPlayOverlayIcon}>{Icons.play}</div>
              </div>
            </div>
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
  const [videoOuverte, setVideoOuverte] = useState(null); // { src, caption } | null

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
          <GalItem
            key={i}
            item={item}
            lang={lang}
            onOpenVideo={(src, caption) => setVideoOuverte({ src, caption })}
          />
        ))}
      </div>

      {videoOuverte && (
        <VideoLightbox
          src={videoOuverte.src}
          caption={videoOuverte.caption}
          onClose={() => setVideoOuverte(null)}
        />
      )}
    </section>
  );
}
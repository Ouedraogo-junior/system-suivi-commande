import styles from './LogoAssembly.module.css';
import icon from '../../../assets/logo-icon.png';
import name from '../../../assets/logo-name.png';
import subtitle from '../../../assets/logo-subtitle.png';

export default function LogoAssembly({ background = 'white', align = 'center', maxWidth }) {
  const bounded = Boolean(maxWidth); // maxWidth fourni = logo plafonne (non responsive plein largeur)

  return (
    <section
      className={`${styles.section} ${background === 'transparent' ? styles.sectionTransparent : ''}`}
      aria-label="Animation logo SOGECOP"
      style={{
        justifyContent: align === 'left' ? 'flex-start' : 'center',
        ...(bounded
          ? { '--logo-max-width': typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }
          : {}),
      }}
    >
      <div className={`${styles.stageOuter} ${bounded ? styles.capped : ''}`}>
        <div className={styles.stage}>
          <img src={icon} alt="" aria-hidden="true" className={`${styles.part} ${styles.icon}`} />
          <div className={`${styles.part} ${styles.line}`} aria-hidden="true" />
          <img src={name} alt="" aria-hidden="true" className={`${styles.part} ${styles.name}`} />
          <img
            src={subtitle}
            alt="Société Générale de Commerce et de Prestations"
            className={`${styles.part} ${styles.subtitle}`}
          />
        </div>
      </div>
    </section>
  );
}
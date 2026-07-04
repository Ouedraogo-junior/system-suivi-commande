// src/pages/public/components/services/DomaineSection.jsx
import styles from './ServicesComponents.module.css';

const IconCheck = <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;

export default function DomaineSection({ domaine, index, icon, color, lang }) {
  const isAlt = index % 2 === 1;

  return (
    <section
      id={domaine.id}
      className={`${styles.domaine} ${isAlt ? styles.domaineAlt : ''}`}
    >
      <div className={styles.domaineHeader}>
        <div className={styles.domaineIconWrap} style={{ background: color }}>
          {icon}
        </div>
        <div>
          <div className={styles.domaineLabel}>{domaine.label}</div>
          <h2 className={styles.domaineTitle}>{domaine.title}</h2>
        </div>
      </div>

      <p className={styles.domaineIntro}>{domaine.intro}</p>

      <div className={styles.categoriesGrid}>
        {domaine.categories.map((cat, j) => (
          <div key={j} className={styles.catCard}>
            <div className={styles.catCardBar} style={{ background: color }} />
            <div className={styles.catCardInner}>
              <div className={styles.catName}>{cat.name}</div>
              <ul className={styles.catList}>
                {cat.items.map((item, k) => (
                  <li key={k} className={styles.catItem}>
                    <span className={styles.catCheck}>{IconCheck}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className={styles.catVisual}>
          {domaine.img
            ? (
              <img
                src={domaine.img}
                alt={domaine.title}
                className={styles.catVisualImg}
              />
            )
            : (
              <div className={styles.catVisualInner}>
                <div className={styles.catVisualIcon} style={{ color }}>{icon}</div>
                <span className={styles.catVisualLabel}>{domaine.title}</span>
                <span className={styles.catVisualSub}>
                  {lang === 'fr' ? 'Photo à intégrer' : 'Photo to add'}
                </span>
              </div>
            )
          }
        </div>
      </div>
    </section>
  );
}
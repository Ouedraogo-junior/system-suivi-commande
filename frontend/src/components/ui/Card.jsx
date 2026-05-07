import styles from './Card.module.css';

export function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

export function CardHead({ title, badge, actions }) {
  return (
    <div className={styles.cardHead}>
      <div className={styles.cardHeadLeft}>
        <span className={styles.cardTitle}>{title}</span>
        {badge && <span className={styles.cardBadge}>{badge}</span>}
      </div>
      {actions && <div className={styles.cardActions}>{actions}</div>}
    </div>
  );
}

export function CardBody({ children, noPadding = false }) {
  return (
    <div className={`${styles.cardBody} ${noPadding ? styles.noPadding : ''}`}>
      {children}
    </div>
  );
}
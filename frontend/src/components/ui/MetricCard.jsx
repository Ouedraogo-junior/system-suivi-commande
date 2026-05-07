import styles from './MetricCard.module.css';

export default function MetricCard({ label, value, tag, tagType = 'neutral', color }) {
  return (
    <div className={styles.metric}>
      <div className={styles.label}>{label}</div>
      <div className={styles.value} style={color ? { color } : {}}>
        {value}
      </div>
      {tag && (
        <div className={`${styles.tag} ${styles[tagType]}`}>{tag}</div>
      )}
    </div>
  );
}
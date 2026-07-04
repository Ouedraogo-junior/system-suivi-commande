// src/components/ui/ExpandableText.jsx
import { useState } from 'react';
import styles from './ExpandableText.module.css';

/**
 * @param {string}  text        - Texte complet
 * @param {number}  maxChars    - Seuil avant troncature (défaut 160)
 * @param {object}  labels      - { more: 'Voir plus', less: 'Voir moins' }
 */
export default function ExpandableText({ text, maxChars = 160, labels = {} }) {
  const [expanded, setExpanded] = useState(false);

  const more = labels.more ?? 'Voir plus';
  const less = labels.less ?? 'Voir moins';

  if (!text || text.length <= maxChars) return <p className={styles.body}>{text}</p>;

  return (
    <div className={styles.wrapper}>
      <p className={styles.body}>
        {expanded ? text : `${text.slice(0, maxChars).trimEnd()}…`}
      </p>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setExpanded(v => !v)}
        aria-expanded={expanded}
      >
        {expanded ? less : more}
      </button>
    </div>
  );
}
// src/components/dashboard/nouvellecommande/LignesSection.jsx
import styles from '../../../pages/dashboard/NouvelleCommandePage.module.css';

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

function calcSousTotal(l) {
  const q = parseFloat(l.quantite) || 0;
  const p = parseFloat(l.prix_unitaire) || 0;
  return q * p;
}

export { calcSousTotal, formatMontant };

export default function LignesSection({ lignes, onChange, onAjouter, onSupprimer, errors }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>Lignes de commande</div>
      <div className={styles.cardBody}>
        <div className={styles.lignesHeader}>
          <span style={{ flex: 3 }}>Désignation</span>
          <span style={{ flex: 1 }}>Quantité</span>
          <span style={{ flex: 1.5 }}>Prix unitaire</span>
          <span style={{ flex: 1.5 }}>Sous-total</span>
          <span style={{ width: '28px' }} />
        </div>

        {lignes.map((l, i) => (
          <div key={l._key} className={styles.ligneRow}>
            <div style={{ flex: 3 }}>
              <input
                className={`${styles.finput} ${errors[`lig_${i}_des`] ? styles.inputError : ''}`}
                placeholder="Désignation..."
                value={l.designation}
                onChange={e => onChange(l._key, 'designation', e.target.value)}
              />
              {errors[`lig_${i}_des`] && (
                <div className={styles.fieldError}>{errors[`lig_${i}_des`]}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input
                className={`${styles.finput} ${errors[`lig_${i}_qte`] ? styles.inputError : ''}`}
                type="number" min="0" placeholder="0"
                value={l.quantite}
                onChange={e => onChange(l._key, 'quantite', e.target.value)}
              />
              {errors[`lig_${i}_qte`] && (
                <div className={styles.fieldError}>{errors[`lig_${i}_qte`]}</div>
              )}
            </div>
            <div style={{ flex: 1.5 }}>
              <input
                className={`${styles.finput} ${errors[`lig_${i}_pu`] ? styles.inputError : ''}`}
                type="number" min="0" placeholder="0"
                value={l.prix_unitaire}
                onChange={e => onChange(l._key, 'prix_unitaire', e.target.value)}
              />
              {errors[`lig_${i}_pu`] && (
                <div className={styles.fieldError}>{errors[`lig_${i}_pu`]}</div>
              )}
            </div>
            <div style={{ flex: 1.5 }} className={styles.sousTotal}>
              {formatMontant(calcSousTotal(l))}
            </div>
            <button
              className={styles.deleteBtn}
              onClick={() => onSupprimer(l._key)}
              disabled={lignes.length === 1}
              title="Supprimer la ligne"
            >
              ×
            </button>
          </div>
        ))}

        <button className={styles.addLigneBtn} onClick={onAjouter}>
          + Ajouter une ligne
        </button>
      </div>
    </div>
  );
}
// src/components/dashboard/nouvellecommande/ParametresSection.jsx
import styles from '../../../pages/dashboard/NouvelleCommandePage.module.css';

const SERVICES = [
  { value: 'IMPRIMERIE',   label: 'Imprimerie Générale' },
  { value: 'INFORMATIQUE', label: 'Fournitures Informatiques' },
  { value: 'NEGOCE',       label: 'Négoce International' },
  { value: 'AMENAGEMENT',  label: 'Aménagement' },
];

export default function ParametresSection({
  service,        onServiceChange,
  remise,         onRemiseChange,
  remiseType,     onRemiseTypeChange,
  tva,            onTvaChange,
  tvaTaux,        onTvaTauxChange,
  dateEcheance,   onDateEcheanceChange,
  notes,          onNotesChange,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>Paramètres</div>
      <div className={styles.cardBody}>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Service *</label>
          <select className={styles.fselect} value={service}
            onChange={e => onServiceChange(e.target.value)}>
            {SERVICES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Remise</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className={styles.finput}
              type="number"
              min="0"
              max={remiseType === 'PERCENT' ? 100 : undefined}
              step={remiseType === 'PERCENT' ? '1' : '0.01'}
              placeholder="0"
              value={remise}
              onChange={e => onRemiseChange(e.target.value)}
            />
            <select
              className={styles.fselect}
              value={remiseType}
              onChange={e => onRemiseTypeChange(e.target.value)}
            >
              <option value="PERCENT">%</option>
              <option value="MONTANT">Montant</option>
            </select>
          </div>
        </div>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Date d'échéance</label>
          <input
            className={styles.finput}
            type="date"
            value={dateEcheance}
            onChange={e => onDateEcheanceChange(e.target.value)}
          />
        </div>

        {/* TVA : checkbox + champ taux conditionnel */}
        <div className={styles.fgroup}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={tva}
              onChange={e => onTvaChange(e.target.checked)}
            />
            TVA applicable
          </label>
        </div>

        {tva && (
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Taux TVA (%)</label>
            <input
              className={styles.finput}
              type="number" min="0" max="100" step="0.01"
              placeholder="18"
              value={tvaTaux}
              onChange={e => onTvaTauxChange(parseFloat(e.target.value) || 0)}
            />
          </div>
        )}

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Notes</label>
          <textarea
            className={styles.ftextarea}
            placeholder="Remarques internes..."
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
          />
        </div>

      </div>
    </div>
  );
}
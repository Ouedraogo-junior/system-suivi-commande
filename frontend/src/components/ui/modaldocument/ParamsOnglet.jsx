// src/components/ui/modaldocument/ParamsOnglet.jsx
import {
  REMISE_OPTIONS, ACOMPTE_OPTIONS, DELAI_OPTIONS,
  VALIDITE_OPTIONS, CONDITIONS_IMPRIMERIE, calculs, fmt,
} from './useDocumentModal';
import styles from '../ModalDocument.module.css';

export default function ParamsOnglet({
  commande, isProforma, isImprimerie, tvaTaux,
  remiseTaux,    setRemiseTaux,    remiseLibre,   setRemiseLibre,
  delai,         setDelai,         delaiLibre,    setDelaiLibre,
  acompteTaux,   setAcompteTaux,   acompteLibre,  setAcompteLibre,
  conditions,    setConditions,
  validite,      setValidite,      validiteLibre, setValiditeLibre,
  remiseFinal, acompteFinal,
}) {
  const c = calculs(commande, remiseFinal, acompteTaux, acompteFinal, tvaTaux);

  return (
    <div className={styles.params}>

      {/* ── Remise ── */}
      <div className={styles.paramGroup}>
        <label className={styles.paramLabel}>Remise</label>
        <div className={styles.optionBtns}>
          {REMISE_OPTIONS.map(v => (
            <button
              key={v}
              className={`${styles.optBtn} ${remiseTaux === v && remiseLibre === '' ? styles.optBtnOn : ''}`}
              onClick={() => { setRemiseTaux(v); setRemiseLibre(''); }}
            >
              {v === 0 ? 'Aucune' : `${v}%`}
            </button>
          ))}
        </div>
        <input
          className={styles.libreInput}
          type="number" min="0" max="100"
          placeholder="Autre taux... (%)"
          value={remiseLibre}
          onChange={e => setRemiseLibre(e.target.value)}
        />
      </div>

      {/* ── Délai livraison (pro forma) ── */}
      {isProforma && (
        <div className={styles.paramGroup}>
          <label className={styles.paramLabel}>Délai de livraison</label>
          <div className={styles.optionBtns}>
            {DELAI_OPTIONS.map(v => (
              <button
                key={v}
                className={`${styles.optBtn} ${delai === v && !delaiLibre ? styles.optBtnOn : ''}`}
                onClick={() => { setDelai(v); setDelaiLibre(''); }}
              >
                {v}
              </button>
            ))}
          </div>
          <input
            className={styles.libreInput}
            type="text"
            placeholder="Délai libre..."
            value={delaiLibre}
            onChange={e => setDelaiLibre(e.target.value)}
          />
        </div>
      )}

      {/* ── Acompte (pro forma) ── */}
      {isProforma && (
        <div className={styles.paramGroup}>
          <label className={styles.paramLabel}>Acompte demandé</label>
          <div className={styles.optionBtns}>
            {ACOMPTE_OPTIONS.map(v => (
              <button
                key={v}
                className={`${styles.optBtn} ${acompteTaux === v && acompteLibre === '' ? styles.optBtnOn : ''}`}
                onClick={() => { setAcompteTaux(v); setAcompteLibre(''); }}
              >
                {v === 0 ? 'Aucun' : `${v}%`}
              </button>
            ))}
          </div>
          <input
            className={styles.libreInput}
            type="number" min="0"
            placeholder="Montant libre (F CFA)..."
            value={acompteLibre}
            onChange={e => setAcompteLibre(e.target.value)}
          />
        </div>
      )}

      {/* ── Conditions (pro forma) ── */}
      {isProforma && (
        <div className={styles.paramGroup}>
          <label className={styles.paramLabel}>Conditions</label>
          {isImprimerie ? (
            <div className={styles.conditionsFixed}>
              {CONDITIONS_IMPRIMERIE}
            </div>
          ) : (
            <textarea
              className={styles.libreTextarea}
              rows={4}
              placeholder="Saisir les conditions applicables..."
              value={conditions}
              onChange={e => setConditions(e.target.value)}
            />
          )}
        </div>
      )}

      {/* ── Délai de validité (pro forma) ── */}
      {isProforma && (
        <div className={styles.paramGroup}>
          <label className={styles.paramLabel}>Validité du pro forma</label>
          <div className={styles.optionBtns}>
            {VALIDITE_OPTIONS.map(v => (
              <button
                key={v}
                className={`${styles.optBtn} ${validite === v && !validiteLibre ? styles.optBtnOn : ''}`}
                onClick={() => { setValidite(v); setValiditeLibre(''); }}
              >
                {v}
              </button>
            ))}
          </div>
          <input
            className={styles.libreInput}
            type="text"
            placeholder="Durée libre... (ex: 90 jours)"
            value={validiteLibre}
            onChange={e => setValiditeLibre(e.target.value)}
          />
        </div>
      )}

      {/* ── Récap rapide ── */}
      <div className={styles.recapRapide}>
        <div className={styles.recapRow}><span>Total TTC</span><span>{fmt(c.ttc)}</span></div>
        {isProforma && c.acompte > 0 && (
          <div className={styles.recapRow}><span>Acompte</span><span>{fmt(c.acompte)}</span></div>
        )}
        {isProforma && (
          <div className={`${styles.recapRow} ${styles.recapTotal}`}>
            <span>Reste à payer</span><span>{fmt(c.reste)}</span>
          </div>
        )}
        {!isProforma && (
          <div className={`${styles.recapRow} ${styles.recapTotal}`}>
            <span>Solde restant</span>
            <span>{c.solde <= 0 ? '✓ Soldée' : fmt(c.solde)}</span>
          </div>
        )}
      </div>

    </div>
  );
}
// src/components/ui/ModalDocument.jsx
import Button from './Button';
import useDocumentModal from './modaldocument/useDocumentModal';
import ParamsOnglet from './modaldocument/ParamsOnglet';
import ApercuOnglet from './modaldocument/ApercuOnglet';
import styles from './ModalDocument.module.css';

export default function ModalDocument({ commande, type, onClose }) {
  const modal = useDocumentModal(commande, type, onClose);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.modalHead}>
          <div className={styles.modalTitle}>
            {modal.isProforma ? '📄 Générer un pro forma' : '🧾 Générer la facture définitive'}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Onglets */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${modal.onglet === 'params' ? styles.tabActive : ''}`}
            onClick={() => modal.setOnglet('params')}
          >
            Paramètres
          </button>
          <button
            className={`${styles.tab} ${modal.onglet === 'apercu' ? styles.tabActive : ''}`}
            onClick={() => modal.setOnglet('apercu')}
          >
            Aperçu
          </button>
        </div>

        {/* Contenu */}
        {modal.onglet === 'params' && (
          <ParamsOnglet
            commande={commande}
            isProforma={modal.isProforma}
            isImprimerie={modal.isImprimerie}
            tvaTaux={modal.tvaTaux}
            remiseTaux={modal.remiseTaux}       setRemiseTaux={modal.setRemiseTaux}
            remiseLibre={modal.remiseLibre}     setRemiseLibre={modal.setRemiseLibre}
            delai={modal.delai}                 setDelai={modal.setDelai}
            delaiLibre={modal.delaiLibre}       setDelaiLibre={modal.setDelaiLibre}
            acompteTaux={modal.acompteTaux}     setAcompteTaux={modal.setAcompteTaux}
            acompteLibre={modal.acompteLibre}   setAcompteLibre={modal.setAcompteLibre}
            conditions={modal.conditions}       setConditions={modal.setConditions}
            validite={modal.validite}           setValidite={modal.setValidite}
            validiteLibre={modal.validiteLibre} setValiditeLibre={modal.setValiditeLibre}
            remiseFinal={modal.remiseFinal}
            acompteFinal={modal.acompteFinal}
          />
        )}

        {modal.onglet === 'apercu' && (
          <ApercuOnglet
            commande={commande}
            type={type}
            remiseTaux={modal.remiseFinal}
            acompteTaux={modal.acompteTaux}
            acompteFinal={modal.acompteFinal}
            delai={modal.delaiFinal}
            tvaTaux={modal.tvaTaux}
            conditions={modal.conditions}
            validiteFinal={modal.validiteFinal}
            isImprimerie={modal.isImprimerie}
          />
        )}

        {/* Footer */}
        <div className={styles.modalFooter}>
          <Button variant="ghost" size="sm" onClick={onClose}>Annuler</Button>
          <Button
            variant="primary" size="sm"
            onClick={modal.handleGenerer}
            disabled={modal.generating}
          >
            {modal.generating ? 'Génération...' : '⬇ Télécharger le PDF'}
          </Button>
        </div>

      </div>
    </div>
  );
}
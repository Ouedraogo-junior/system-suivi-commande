// src/components/ui/ModalDocument.jsx
import Button from './Button';
import useDocumentModal from './modaldocument/useDocumentModal';
import ParamsOnglet from './modaldocument/ParamsOnglet';
import ApercuOnglet from './modaldocument/ApercuOnglet';
import styles from './ModalDocument.module.css';

const TITRES = {
  PRO_FORMA:     '📄 Générer un pro forma',
  FACTURE:       '🧾 Générer la facture définitive',
  BON_LIVRAISON: '📦 Générer un bon de livraison',
};

export default function ModalDocument({ commande, type, onClose }) {
  const modal = useDocumentModal(commande, type, onClose);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.modalHead}>
          <div className={styles.modalTitle}>{TITRES[type]}</div>
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
            isFacture={modal.isFacture}
            isBonLiv={modal.isBonLiv}
            isImprimerie={modal.isImprimerie}
            tvaTaux={modal.tvaTaux}
            remiseTaux={modal.remiseTaux}       setRemiseTaux={modal.setRemiseTaux}
            remiseLibre={modal.remiseLibre}     setRemiseLibre={modal.setRemiseLibre}
            remiseType={modal.remiseType}       setRemiseType={modal.setRemiseType}
            delai={modal.delai}                 setDelai={modal.setDelai}
            delaiLibre={modal.delaiLibre}       setDelaiLibre={modal.setDelaiLibre}
            acompteTaux={modal.acompteTaux}     setAcompteTaux={modal.setAcompteTaux}
            acompteLibre={modal.acompteLibre}   setAcompteLibre={modal.setAcompteLibre}
            conditions={modal.conditions}       setConditions={modal.setConditions}
            validite={modal.validite}           setValidite={modal.setValidite}
            validiteLibre={modal.validiteLibre} setValiditeLibre={modal.setValiditeLibre}
            objet={modal.objet}                 setObjet={modal.setObjet}
            sansCachet={modal.sansCachet}       setSansCachet={modal.setSansCachet}
            remiseFinal={modal.remiseFinal}
            acompteFinal={modal.acompteFinal}
          />
        )}

        <ApercuOnglet
          commande={commande}
          type={type}
          remiseTaux={modal.remiseFinal}
          remiseType={modal.remiseType}
          remiseLibre={modal.remiseLibre}
          acompteTaux={modal.acompteTaux}
          acompteFinal={modal.acompteFinal}
          delai={modal.delaiFinal}
          tvaTaux={modal.tvaTaux}
          conditions={modal.conditions}
          validiteFinal={modal.validiteFinal}
          isImprimerie={modal.isImprimerie}
          objet={modal.objet}
          sansCachet={modal.sansCachet}
        />

        {/* Footer */}
       <div className={styles.modalFooter}>
          <Button variant="ghost" size="sm" onClick={onClose}>Annuler</Button>
          <Button variant="outline" size="sm" onClick={modal.handleImprimer} disabled={modal.generating}>
            {modal.generating ? 'Génération...' : '🖨 Imprimer'}
          </Button>
          <Button variant="primary" size="sm" onClick={modal.handleTelecharger} disabled={modal.generating}>
            {modal.generating ? 'Génération...' : '⬇ Télécharger'}
          </Button>
        </div>
      </div>
    </div>
  );
}
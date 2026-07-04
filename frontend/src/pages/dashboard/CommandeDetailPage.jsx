// src/pages/dashboard/CommandeDetailPage.jsx
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ModalDocument from '../../components/ui/ModalDocument';
import useCommandeDetail, { STATUTS_SUIVANTS, formatMontant } from '../dashboard/commandedetail/useCommandeDetail';
import InformationsSection from '../dashboard/commandedetail/InformationsSection';
import { ClientCard, HistoriqueSection, LignesCommandeSection, VersementsSection } from '../dashboard/commandedetail/DetailSections';
import {
  ModalStatut, ModalVersement, ModalVersementEdit,
  ModalEditionLignes, ModalEditionInfos,
} from '../dashboard/commandedetail/ModalsCommande';
import styles from './CommandeDetailPage.module.css';

export default function CommandeDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';

  const {
    commande, loading, error, actionLoading,
    handleChangerStatut, handleVersement, handleEditVersement,
    handleSupprimerVersement, handleEditionLignes, handleEditionInfos,
  } = useCommandeDetail(id);

  // ── État d'affichage des modals (reste ici, séparé du hook) ────────────────
  const [modalDoc, setModalDoc]           = useState(null); // 'PRO_FORMA' | 'FACTURE' | 'BON_LIVRAISON' | null
  const [modalStatut, setModalStatut]     = useState(false);
  const [modalVers, setModalVers]         = useState(false);
  const [modalEditVers, setModalEditVers] = useState(null); // versement en cours d'édition
  const [modalEdition, setModalEdition]   = useState(false);
  const [modalInfos, setModalInfos]       = useState(false);

  // ── Rendu ──────────────────────────────────────────────
  if (loading) {
    return (
      <AppLayout title="Commande" subtitle="Chargement...">
        <div className={styles.loadingMsg}>Chargement...</div>
      </AppLayout>
    );
  }

  if (error || !commande) {
    return (
      <AppLayout title="Commande introuvable">
        <div className={styles.errorMsg}>{error}</div>
      </AppLayout>
    );
  }

  const pctPaye = commande.montant_total > 0
    ? Math.min(100, Math.round((commande.montant_paye / commande.montant_total) * 100))
    : 0;

  const peutChangerStatut = STATUTS_SUIVANTS[commande.statut]?.length > 0;
  const peutModifier = commande.statut !== 'ANNULE';

  return (
    <AppLayout
      title={commande.reference}
      subtitle={`Client : ${commande.client?.nom_complet}`}
      topbarActions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            ← Retour
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setModalDoc('PRO_FORMA')}>
            📄 Pro forma
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setModalDoc('FACTURE')}>
            🧾 Facture
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setModalDoc('BON_LIVRAISON')}>
            📦 Bon de livraison
          </Button>
          {peutChangerStatut && (
            <Button variant="primary" size="sm" onClick={() => setModalStatut(true)}>
              Changer statut
            </Button>
          )}
        </div>
      }
    >
      {/* ── Résumé ── */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Statut commande</div>
          <Badge type={commande.statut} />
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Statut paiement</div>
          <Badge type={commande.statut_paiement} />
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Montant total</div>
          <div className={styles.summaryValue}>{formatMontant(commande.montant_total)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Reste à payer</div>
          <div className={`${styles.summaryValue} ${styles.reste}`}>
            {formatMontant(commande.montant_total - commande.montant_paye)}
          </div>
        </div>
      </div>

      {/* Barre progression paiement */}
      <div className={styles.progressWrap}>
        <div className={styles.progressTop}>
          <span>Paiement : {formatMontant(commande.montant_paye)} / {formatMontant(commande.montant_total)}</span>
          <span>{pctPaye}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pctPaye}%` }} />
        </div>
      </div>

      <div className={styles.grid}>
        {/* Colonne gauche */}
        <div className={styles.colLeft}>
          <InformationsSection
            commande={commande}
            peutModifier={peutModifier}
            onModifier={() => setModalInfos(true)}
          />
          <ClientCard commande={commande} />
          <HistoriqueSection commande={commande} />
        </div>

        {/* Colonne droite */}
        <div className={styles.colRight}>
          <LignesCommandeSection
            commande={commande}
            onModifier={() => setModalEdition(true)}
          />
          <VersementsSection
            commande={commande}
            onAjouter={() => setModalVers(true)}
            onModifierVersement={setModalEditVers}
            onSupprimerVersement={handleSupprimerVersement}
          />
        </div>
      </div>

      {/* Modals */}
      {modalStatut && (
        <ModalStatut
          statut={commande.statut}
          onConfirm={async (payload) => {
            if (await handleChangerStatut(payload)) setModalStatut(false);
          }}
          onCancel={() => setModalStatut(false)}
          loading={actionLoading}
        />
      )}

      {modalVers && (
        <ModalVersement
          onConfirm={async (payload) => {
            if (await handleVersement(payload)) setModalVers(false);
          }}
          onCancel={() => setModalVers(false)}
          loading={actionLoading}
        />
      )}

      {modalEditVers && (
        <ModalVersementEdit
          versement={modalEditVers}
          onConfirm={async (payload) => {
            if (await handleEditVersement(modalEditVers.id, payload)) setModalEditVers(null);
          }}
          onCancel={() => setModalEditVers(null)}
          loading={actionLoading}
        />
      )}

      {modalDoc && (
        <ModalDocument
          commande={commande}
          type={modalDoc}
          onClose={() => setModalDoc(null)}
        />
      )}

      {modalEdition && (
        <ModalEditionLignes
          commande={commande}
          onConfirm={async (payload) => {
            if (await handleEditionLignes(payload)) setModalEdition(false);
          }}
          onCancel={() => setModalEdition(false)}
          loading={actionLoading}
        />
      )}

      {modalInfos && (
        <ModalEditionInfos
          commande={commande}
          onConfirm={async (payload) => {
            if (await handleEditionInfos(payload)) setModalInfos(false);
          }}
          onCancel={() => setModalInfos(false)}
          loading={actionLoading}
        />
      )}

    </AppLayout>
  );
}
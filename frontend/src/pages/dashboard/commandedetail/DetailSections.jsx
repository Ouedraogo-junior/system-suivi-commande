// src/components/dashboard/commandedetail/DetailSections.jsx
import { Section } from './InformationsSection';
import Button from '../../../components/ui/Button';
import styles from '../../../pages/dashboard/CommandeDetailPage.module.css';
import { STATUTS_LABELS, formatDate, formatMontant, getInitiales, calculerMontantRemise } from './useCommandeDetail';

// ===== CLIENT =====
export function ClientCard({ commande }) {
  return (
    <Section title="Client">
      <div className={styles.clientBlock}>
        <div className={styles.clientAv}>
          {getInitiales(commande.client?.nom_complet)}
        </div>
        <div>
          <div className={styles.clientName}>{commande.client?.nom_complet}</div>
          {commande.client?.telephone && (
            <div className={styles.clientSub}>{commande.client.telephone}</div>
          )}
          {commande.client?.fax && (
            <div className={styles.clientSub}>Fax : {commande.client.fax}</div>
          )}
          {/* {commande.client?.email && (
            <div className={styles.clientSub}>{commande.client.email}</div>
          )} */}
        </div>
      </div>
    </Section>
  );
}

// ===== HISTORIQUE =====
export function HistoriqueSection({ commande }) {
  return (
    <Section title="Historique">
      {commande.historique?.length > 0 ? (
        <div className={styles.timeline}>
          {commande.historique.map((h, i) => (
            <div key={i} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                <div className={styles.timelineHead}>
                  <span>{h.agent?.nom_complet}</span>
                  <span className={styles.timelineDate}>{formatDate(h.created_at)}</span>
                </div>
                <div className={styles.timelineText}>
                  {h.ancien_statut
                    ? `${STATUTS_LABELS[h.ancien_statut]} → ${STATUTS_LABELS[h.nouveau_statut]}`
                    : `Commande créée — ${STATUTS_LABELS[h.nouveau_statut]}`
                  }
                </div>
                {h.commentaire && (
                  <div className={styles.timelineComment}>{h.commentaire}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyMsg}>Aucun historique.</div>
      )}
    </Section>
  );
}

// ===== LIGNES DE COMMANDE =====
export function LignesCommandeSection({ commande, onModifier }) {
  const sousTotal   = commande.lignes?.reduce((s, l) => s + Number(l.sous_total), 0) || 0;
  const montantRemise = calculerMontantRemise(sousTotal, commande);
  const apresRemise    = sousTotal - montantRemise;
 return (
    <Section
      title="Lignes de commande"
      action={
        commande.statut !== 'ANNULE' && (
          <Button variant="outline" size="sm" onClick={onModifier}>
            ✏️ Modifier
          </Button>
        )
      }
    >
      <div className={styles.lignesWrap}>
        <table className={styles.lignesTable}>
          <thead>
            <tr>
              <th>Désignation</th>
              <th>Qté</th>
              <th>P.U.</th>
              <th>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {commande.lignes?.map((l) => (
              <tr key={l.id}>
                <td>{l.designation}</td>
                <td>{l.quantite}</td>
                <td>{formatMontant(l.prix_unitaire)}</td>
                <td className={styles.sousTotal}>{formatMontant(l.sous_total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {commande.remise > 0 && (
              <tr className={styles.tfootRow}>
                <td colSpan={3}>Remise</td>
                  <td>− {formatMontant(montantRemise)}</td>
              </tr>
            )}
            {commande.tva_applicable && (
              <tr className={styles.tfootRow}>
                <td colSpan={3}>TVA ({commande.tva_taux ?? 18}%)</td>
                <td>+ {formatMontant(apresRemise * ((commande.tva_taux ?? 18) / 100))}</td>
              </tr>
            )}
            <tr className={styles.tfootTotal}>
              <td colSpan={3}>Total</td>
              <td>{formatMontant(commande.montant_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Section>
  );
}

// ===== VERSEMENTS =====
export function VersementsSection({ commande, onAjouter, onModifierVersement, onSupprimerVersement }) {
  return (
    <Section
      title="Versements"
      action={
        commande.statut !== 'ANNULE' && commande.statut_paiement !== 'PAYE' && (
          <Button variant="outline" size="sm" onClick={onAjouter}>
            + Versement
          </Button>
        )
      }
    >
      {commande.versements?.length > 0 ? (
        <div className={styles.versementsWrap}>
          <table className={styles.lignesTable}>
            <thead>
              <tr>
                <th>N°</th>
                <th>Date</th>
                <th>Référence</th>
                <th>Agent</th>
                <th>Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {commande.versements.map((v) => (
                <tr key={v.id}>
                  <td>#{v.numero_versement}</td>
                  <td>{formatDate(v.date_versement)}</td>
                  <td>{v.reference ?? '—'}</td>
                  <td>{v.agent?.nom_complet ?? '—'}</td>
                  <td className={styles.sousTotal}>{formatMontant(v.montant)}</td>
                  <td className={styles.versActions}>
                    <button
                      className={styles.btnVersEdit}
                      title="Modifier"
                      onClick={() => onModifierVersement(v)}
                    >✏️</button>
                    <button
                      className={styles.btnVersDelete}
                      title="Supprimer"
                      onClick={() => onSupprimerVersement(v.id)}
                    >🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.tfootTotal}>
                <td colSpan={4}>Total payé</td>
                <td>{formatMontant(commande.montant_paye)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <div className={styles.emptyMsg}>Aucun versement enregistré.</div>
      )}
    </Section>
  );
}
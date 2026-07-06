// src/components/ui/modaldocument/ApercuOnglet.jsx
import { calculs, fmt } from './useDocumentModal';
import styles from '../ModalDocument.module.css';

// ── Aperçu Bon de Livraison ───────────────────────────────────────────────────
function ApercuBonLivraison({ commande, objet }) {
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className={styles.apercu}>

      {/* Logo */}
      <div className={styles.apercuLogoWrap}>
        {/* <img src="/images/logo.png" alt="SOGECOP" className={styles.apercuLogoImg}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
        /> */}
        <div className={styles.apercuLogoFallback} style={{ display: 'none' }}>
          <div className={styles.apercuLogoText}>SOGECOP</div>
          <div className={styles.apercuLogoSub}>Société Générale de Commerce et de Prestations</div>
        </div>
      </div>

      {/* Titre */}
      <div className={styles.apercuTitre}>
        BON DE LIVRAISON
        <div className={styles.apercuTitreRef}>
          Référence générée à l'impression &nbsp;|&nbsp; {today}
        </div>
      </div>

      {/* Destinataire / Objet */}
      <table className={styles.apercuMetaBox}>
        <tbody>
          <tr>
            <td className={styles.apercuMetaKey}>DOIT :</td>
            <td>
              <strong>{commande.client?.nom_complet}</strong>
              {commande.client?.organisation && ` — ${commande.client.organisation}`}
            </td>
          </tr>
          {objet && (
            <tr>
              <td className={styles.apercuMetaKey}>OBJET :</td>
              <td>{objet}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Lignes */}
      <table className={styles.apercuTable}>
        <thead>
          <tr>
            <th className={styles.center} style={{ width: '28px' }}>N°</th>
            <th>Désignation</th>
            <th className={styles.right} style={{ width: '80px' }}>Quantité</th>
            <th style={{ width: '130px' }}>Observations</th>
          </tr>
        </thead>
        <tbody>
          {commande.lignes?.map((l, i) => (
            <tr key={l.id}>
              <td className={styles.center}>{i + 1}</td>
              <td>{l.designation}</td>
              <td className={styles.right}>{Number(l.quantite).toLocaleString('fr-FR')}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Lieu et date */}
      <div className={styles.apercuLieuDate}>
        Ouagadougou le ........./........./{ new Date().getFullYear() }
      </div>

      {/* Signatures */}
      <div className={styles.apercuSignatures}>
        <div>
          <div className={styles.apercuSigLabel}>Le Réceptionniste</div>
          <div className={styles.apercuSigLine}>&nbsp;</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.apercuSigLabel}>Le Fournisseur</div>
          <div className={styles.apercuSigLine}>&nbsp;</div>
        </div>
      </div>

    </div>
  );
}

// ── Aperçu Pro Forma / Facture ────────────────────────────────────────────────
export default function ApercuOnglet({
  commande, type,
  remiseTaux, remiseType, remiseLibre,
  acompteTaux, acompteFinal,
  delai, tvaTaux,
  conditions, validiteFinal,
  objet,
}) {
  const isBonLiv   = type === 'BON_LIVRAISON';
  const isProforma = type === 'PRO_FORMA';

  if (isBonLiv) {
    return (
      <div className={styles.apercuWrap}>
        <ApercuBonLivraison commande={commande} objet={objet} />
      </div>
    );
  }

  const c    = calculs(commande, remiseTaux, acompteTaux, acompteFinal, tvaTaux);
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateEcheance = commande.date_echeance
    ? new Date(commande.date_echeance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;
  const formatDateFr = (d) => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  const serviceLabel = commande.service
    ? commande.service.charAt(0) + commande.service.slice(1).toLowerCase()
    : '';
  const totalLabel = (commande.tva_applicable && tvaTaux > 0) ? 'TTC' : 'HT';
  const badge = commande.statut_paiement === 'PAYE'
    ? { label: 'Soldée', cls: styles.badgePaye }
    : commande.statut_paiement === 'PARTIEL'
      ? { label: 'Partiel', cls: styles.badgePartiel }
      : { label: 'Non payée', cls: styles.badgeNon };

  return (
    <div className={styles.apercuWrap}>
      <div className={styles.apercu}>

        <div className={styles.apercuLogoWrap}>
          <div className={styles.apercuLogoFallback} style={{ display: 'none' }}>
            <div className={styles.apercuLogoText}>SOGECOP</div>
            <div className={styles.apercuLogoSub}>Société Générale de Commerce et de Prestations</div>
          </div>
        </div>

        {/* Titre */}
        <div className={styles.apercuTitre}>
          {isProforma ? 'FACTURE PRO FORMA' : 'FACTURE DÉFINITIVE'} {commande.reference}
          <div className={styles.apercuTitreRef}>Émis le {today}</div>
        </div>

        {/* Meta */}
        <div className={styles.apercuMeta}>
          <div>
            <div className={styles.apercuMetaLabel}>DOIT</div>
            <div className={styles.apercuMetaVal}>
              <strong>{commande.client?.nom_complet}</strong>
              {commande.client?.organisation && <div>{commande.client.organisation}</div>}
              {commande.client?.telephone && <div>Tél : {commande.client.telephone}</div>}
              {commande.client?.email && <div>{commande.client.email}</div>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.apercuMetaLabel}>
              {isProforma ? 'Informations' : 'Détails commande'}
            </div>
            <div className={styles.apercuMetaVal}>
              <div>Réf. commande : <strong>{commande.reference}</strong></div>
              <div>Service : <strong>{serviceLabel}</strong></div>
              {commande.agent?.nom_complet && <div>Agent : {commande.agent.nom_complet}</div>}
              {isProforma && delai && <div>Délai : <strong>{delai}</strong></div>}
              {dateEcheance && <div>Échéance : <strong>{dateEcheance}</strong></div>}
              {!isProforma && (
                <div>Statut : <span className={badge.cls}>{badge.label}</span></div>
              )}
            </div>
          </div>
        </div>

        {/* Lignes */}
        <table className={styles.apercuTable}>
          <thead>
            <tr>
              <th>#</th><th>Désignation</th>
              <th className={styles.right}>Qté</th>
              <th className={styles.right}>P.U.</th>
              <th className={styles.right}>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {commande.lignes?.map((l, i) => (
              <tr key={l.id}>
                <td className={styles.center}>{i + 1}</td>
                <td>{l.designation}</td>
                <td className={styles.right}>{Number(l.quantite).toLocaleString('fr-FR')}</td>
                <td className={styles.right}>{fmt(l.prix_unitaire)}</td>
                <td className={styles.right}>{fmt(l.sous_total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculs */}
        <div className={styles.apercuCalcWrap}>
          <div className={styles.apercuCalc}>
            <div className={styles.apercuCalcRow}><span>Montant brut</span><span>{fmt(c.brut)}</span></div>
            {c.remise > 0 && (
              <div className={styles.apercuCalcRow}>
                <span>Remise {remiseType === 'MONTANT' ? `(${fmt(remiseLibre)})` : ''}</span>
                <span className={styles.rouge}>− {fmt(c.remise)}</span>
              </div>
            )}
            <div className={styles.apercuCalcRow}><span>Montant net HT</span><span>{fmt(c.netHT)}</span></div>
            {commande.tva_applicable && tvaTaux > 0 && (
              <div className={styles.apercuCalcRow}><span>TVA ({tvaTaux}%)</span><span>{fmt(c.tva)}</span></div>
            )}
            <div className={`${styles.apercuCalcRow} ${styles.apercuTTC}`}>
              <span>TOTAL {totalLabel}</span><span>{fmt(c.ttc)}</span>
            </div>
            {isProforma && c.acompte > 0 && (
              <>
                <div className={styles.apercuCalcRow}><span>Acompte demandé</span><span>{fmt(c.acompte)}</span></div>
                <div className={`${styles.apercuCalcRow} ${styles.apercuReste}`}>
                  <span>Reste à payer</span><span>{fmt(c.reste)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Versements + Solde (Facture uniquement) */}
        {!isProforma && (
          commande.versements?.length > 0 ? (
            <>
              <div className={styles.apercuSectionLbl}>Historique des versements</div>
              <table className={styles.apercuTable}>
                <thead>
                  <tr><th>Versement</th><th>Date</th><th>Référence</th><th className={styles.right}>Montant</th></tr>
                </thead>
                <tbody>
                  {commande.versements.map((v) => (
                    <tr key={v.id}>
                      <td>Versement {v.numero_versement}</td>
                      <td>{formatDateFr(v.date_versement)}</td>
                      <td>{v.reference ?? '—'}</td>
                      <td className={styles.right}>{fmt(v.montant)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr><td colSpan={3}>Total versé</td><td className={styles.right}>{fmt(c.totalVerse)}</td></tr>
                </tfoot>
              </table>

              <div className={styles.apercuCalcWrap}>
                <div className={styles.apercuCalc}>
                  <div className={styles.apercuCalcRow}><span>Total {totalLabel}</span><span>{fmt(c.ttc)}</span></div>
                  <div className={styles.apercuCalcRow}>
                    <span>Total versé</span><span className={styles.vert}>− {fmt(c.totalVerse)}</span>
                  </div>
                  <div className={`${styles.apercuCalcRow} ${styles.apercuReste}`}>
                    <span>Solde restant dû</span>
                    <span>{c.solde <= 0 ? 'Soldée ✓' : fmt(c.solde)}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyMsg}>Aucun versement enregistré.</div>
          )
        )}

        {isProforma && (conditions || commande.service === 'IMPRIMERIE') && (
          <div className={styles.apercuConditions}>
            <strong>Conditions</strong><br />
            {conditions.split('\n').map((line, i) => (<span key={i}>{line}<br /></span>))}
            <strong>Ce pro forma est valable {validiteFinal} à compter de la date d'émission.</strong>
          </div>
        )}

        <div className={styles.apercuSignatures}>
          <div>
            <div className={styles.apercuSigLabel}>Le client</div>
            <div className={styles.apercuSigName}>{commande.client?.nom_complet}</div>
            <div className={styles.apercuSigLine}>Signature &amp; cachet</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={styles.apercuSigLabel}>Le responsable</div>
            <div className={styles.apercuSigLine}>Signature &amp; cachet</div>
          </div>
        </div>

      </div>
    </div>
  );
}
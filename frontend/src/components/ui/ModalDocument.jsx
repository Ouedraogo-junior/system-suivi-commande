// src/components/ui/ModalDocument.jsx
import { useState } from 'react';
import api from '../../lib/axios';
import Button from './Button';
import styles from './ModalDocument.module.css';

// ===== CONSTANTES =====
const REMISE_OPTIONS   = [0, 20, 30, 50];
const ACOMPTE_OPTIONS  = [0, 50, 70, 100];
const DELAI_OPTIONS    = ['1 jour', '3 jours', '5 jours', '7 jours', '10 jours', '15 jours', '20 jours'];

// ===== HELPERS =====
function fmt(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F CFA';
}

function calculs(commande, remiseTaux, acompteTaux, acompteMontantLibre) {
  const brut        = commande.lignes?.reduce((s, l) => s + Number(l.sous_total), 0) || 0;
  const remise      = brut * (remiseTaux / 100);
  const netHT       = brut - remise;
  const tva         = netHT * 0.18;
  const ttc         = netHT + tva;
  const acompte     = acompteMontantLibre > 0
    ? acompteMontantLibre
    : ttc * (acompteTaux / 100);
  const reste       = ttc - acompte;
  const totalVerse  = commande.versements?.reduce((s, v) => s + Number(v.montant), 0) || 0;
  const solde       = ttc - totalVerse;

  return { brut, remise, netHT, tva, ttc, acompte, reste, totalVerse, solde };
}

// ===== PRÉVISUALISATION =====
function Apercu({ commande, type, remiseTaux, acompteTaux, acompteMontantLibre, delai }) {
  const c = calculs(commande, remiseTaux, acompteTaux, acompteMontantLibre);
  const isProforma = type === 'PRO_FORMA';
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className={styles.apercu}>
      {/* Header */}
      <div className={styles.apercuHeader}>
        <div className={styles.apercuLogo}>
          <div className={styles.apercuLogoText}>SOGECOP</div>
          <div className={styles.apercuLogoSub}>Société Générale de Commerce et de Prestations</div>
        </div>
        <div className={styles.apercuHeaderInfo}>
          <div>Rue du 17 Octobre, Bld Muammar Kaddafi</div>
          <div>11 BP 268 OUAGA 11, Ouaga 2000</div>
          <div>Tél : (+226) 55 08 86 36 / 70 51 13 84</div>
          <div>sogecop.sarl.bf@gmail.com</div>
        </div>
      </div>

      {/* Titre */}
      <div className={styles.apercuTitre}>
        {isProforma ? 'PRO FORMA' : 'FACTURE DÉFINITIVE'}
        <div className={styles.apercuTitreRef}>
          Référence générée à l'impression &nbsp;|&nbsp; {today}
        </div>
      </div>

      {/* Meta */}
      <div className={styles.apercuMeta}>
        <div>
          <div className={styles.apercuMetaLabel}>Destinataire</div>
          <div className={styles.apercuMetaVal}>
            <strong>{commande.client?.nom_complet}</strong>
            {commande.client?.organisation && <div>{commande.client.organisation}</div>}
            {commande.client?.telephone    && <div>{commande.client.telephone}</div>}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className={styles.apercuMetaLabel}>Détails</div>
          <div className={styles.apercuMetaVal}>
            <div>Réf. commande : <strong>{commande.reference}</strong></div>
            {delai && <div>Délai : <strong>{delai}</strong></div>}
          </div>
        </div>
      </div>

      {/* Lignes */}
      <table className={styles.apercuTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Désignation</th>
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
          <div className={styles.apercuCalcRow}>
            <span>Montant brut</span><span>{fmt(c.brut)}</span>
          </div>
          {remiseTaux > 0 && (
            <div className={styles.apercuCalcRow}>
              <span>Remise ({remiseTaux}%)</span>
              <span className={styles.rouge}>− {fmt(c.remise)}</span>
            </div>
          )}
          <div className={styles.apercuCalcRow}>
            <span>Montant net HT</span><span>{fmt(c.netHT)}</span>
          </div>
          <div className={styles.apercuCalcRow}>
            <span>TVA (18%)</span><span>{fmt(c.tva)}</span>
          </div>
          <div className={`${styles.apercuCalcRow} ${styles.apercuTTC}`}>
            <span>TOTAL TTC</span><span>{fmt(c.ttc)}</span>
          </div>

          {isProforma && c.acompte > 0 && (
            <>
              <div className={styles.apercuCalcRow}>
                <span>Acompte demandé</span><span>{fmt(c.acompte)}</span>
              </div>
              <div className={`${styles.apercuCalcRow} ${styles.apercuReste}`}>
                <span>Reste à payer</span><span>{fmt(c.reste)}</span>
              </div>
            </>
          )}

          {!isProforma && (
            <>
              {commande.versements?.length > 0 && commande.versements.map((v, i) => (
                <div key={v.id} className={styles.apercuCalcRow}>
                  <span>Versement {i + 1} — {new Date(v.date_versement).toLocaleDateString('fr-FR')}</span>
                  <span className={styles.vert}>− {fmt(v.montant)}</span>
                </div>
              ))}
              <div className={styles.apercuCalcRow}>
                <span>Total versé</span>
                <span className={styles.vert}>{fmt(c.totalVerse)}</span>
              </div>
              <div className={`${styles.apercuCalcRow} ${styles.apercuReste}`}>
                <span>Solde restant dû</span>
                <span>{c.solde <= 0 ? '✓ Soldée' : fmt(c.solde)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Conditions (pro forma uniquement) */}
      {isProforma && (
        <div className={styles.apercuConditions}>
          <strong>Conditions</strong><br />
          Condition 1 : Délai de production et de réception 01–20 jours à compter de la validation de la maquette.<br />
          Condition 2 : Paiement préalable d'un acompte de 70% si TTC {'>'} 200 000 F CFA, sinon 50% à la commande.<br />
          <strong>Pro forma valable 30 jours.</strong>
        </div>
      )}

      {/* Signatures */}
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
  );
}

// ===== MODAL PRINCIPAL =====
export default function ModalDocument({ commande, type, onClose }) {
  const isProforma = type === 'PRO_FORMA';

  // Paramètres
  const [remiseTaux,           setRemiseTaux]      = useState(Number(commande.remise) || 0);
  const [remiseLibre,          setRemiseLibre]      = useState('');
  const [acompteTaux,          setAcompteTaux]      = useState(0);
  const [acompteLibre,         setAcompteLibre]     = useState('');
  const [delai,                setDelai]            = useState('');
  const [delaiLibre,           setDelaiLibre]       = useState('');
  const [onglet,               setOnglet]           = useState('params'); // 'params' | 'apercu'
  const [generating,           setGenerating]       = useState(false);

  const remiseFinal  = remiseLibre !== '' ? parseFloat(remiseLibre) || 0 : remiseTaux;
  const acompteFinal = acompteLibre !== '' ? parseFloat(acompteLibre) || 0 : 0;
  const delaiFinal   = delaiLibre || delai || null;

  const handleGenerer = async () => {
    setGenerating(true);
    try {
      const endpoint = isProforma
        ? `/commandes/${commande.id}/documents/proforma`
        : `/commandes/${commande.id}/documents/facture`;

      const payload = isProforma
        ? {
            remise_taux:     remiseFinal,
            delai_livraison: delaiFinal,
            acompte_taux:    acompteLibre !== '' ? 0 : acompteTaux,
            acompte_montant: acompteLibre !== '' ? parseFloat(acompteLibre) || 0 : 0,
          }
        : { remise_taux: remiseFinal };

      const response = await api.post(endpoint, payload, { responseType: 'blob' });

      // Ouvrir dans un nouvel onglet pour impression
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url  = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);

      onClose();
    } catch {
      alert('Erreur lors de la génération du document.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        {/* Header modal */}
        <div className={styles.modalHead}>
          <div className={styles.modalTitle}>
            {isProforma ? '📄 Générer un pro forma' : '🧾 Générer la facture définitive'}
          </div>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        {/* Onglets */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${onglet === 'params' ? styles.tabActive : ''}`}
            onClick={() => setOnglet('params')}
          >
            Paramètres
          </button>
          <button
            className={`${styles.tab} ${onglet === 'apercu' ? styles.tabActive : ''}`}
            onClick={() => setOnglet('apercu')}
          >
            Aperçu
          </button>
        </div>

        {/* ── ONGLET PARAMÈTRES ── */}
        {onglet === 'params' && (
          <div className={styles.params}>

            {/* Remise */}
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
              <div className={styles.libreRow}>
                <input
                  className={styles.libreInput}
                  type="number" min="0" max="100"
                  placeholder="Autre taux... (%)"
                  value={remiseLibre}
                  onChange={e => setRemiseLibre(e.target.value)}
                />
              </div>
            </div>

            {/* Délai (pro forma uniquement) */}
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
                <div className={styles.libreRow}>
                  <input
                    className={styles.libreInput}
                    type="text"
                    placeholder="Délai libre..."
                    value={delaiLibre}
                    onChange={e => setDelaiLibre(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Acompte (pro forma uniquement) */}
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
                <div className={styles.libreRow}>
                  <input
                    className={styles.libreInput}
                    type="number" min="0"
                    placeholder="Montant libre (F CFA)..."
                    value={acompteLibre}
                    onChange={e => setAcompteLibre(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Récap rapide */}
            <div className={styles.recapRapide}>
              {(() => {
                const c = calculs(commande, remiseFinal, acompteTaux, acompteFinal);
                return (
                  <>
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
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── ONGLET APERÇU ── */}
        {onglet === 'apercu' && (
          <div className={styles.apercuWrap}>
            <Apercu
              commande={commande}
              type={type}
              remiseTaux={remiseFinal}
              acompteTaux={acompteTaux}
              acompteMontantLibre={acompteFinal}
              delai={delaiFinal}
            />
          </div>
        )}

        {/* Footer */}
        <div className={styles.modalFooter}>
          <Button variant="ghost" size="sm" onClick={onClose}>Annuler</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerer}
            disabled={generating}
          >
            {generating ? 'Génération...' : '⬇ Télécharger le PDF'}
          </Button>
        </div>

      </div>
    </div>
  );
}
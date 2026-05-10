// src/pages/dashboard/CommandeDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../lib/axios';
import styles from './CommandeDetailPage.module.css';
import ModalDocument from '../../components/ui/ModalDocument';

// ===== HELPERS =====
const SERVICES_LABELS = {
  IMPRIMERIE:   'Imprimerie',
  INFORMATIQUE: 'Informatique',
  NEGOCE:       'Négoce',
  AMENAGEMENT:  'Aménagement',
};

const STATUTS_SUIVANTS = {
  EN_ATTENTE: ['EN_COURS', 'ANNULE'],
  EN_COURS:   ['TERMINE', 'ANNULE'],
  TERMINE:    [],
  ANNULE:     [],
};

const STATUTS_LABELS = {
  EN_ATTENTE: 'En attente',
  EN_COURS:   'En cours',
  TERMINE:    'Terminée',
  ANNULE:     'Annulée',
};

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ===== SECTION CARD =====
function Section({ title, children, action }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitle}>{title}</div>
        {action}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

// ===== CHAMP INFO =====
function InfoField({ label, value }) {
  return (
    <div className={styles.infoField}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value ?? '—'}</div>
    </div>
  );
}

// ===== MODAL STATUT =====
function ModalStatut({ statut, onConfirm, onCancel, loading }) {
  const options = STATUTS_SUIVANTS[statut] ?? [];
  const [choix, setChoix]         = useState(options[0] ?? '');
  const [commentaire, setComment] = useState('');

  if (options.length === 0) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Changer le statut</div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Nouveau statut</label>
          <select
            className={styles.fselect}
            value={choix}
            onChange={e => setChoix(e.target.value)}
          >
            {options.map(s => (
              <option key={s} value={s}>{STATUTS_LABELS[s]}</option>
            ))}
          </select>
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Commentaire (optionnel)</label>
          <textarea
            className={styles.ftextarea}
            value={commentaire}
            onChange={e => setComment(e.target.value)}
            placeholder="Remarque sur le changement de statut..."
          />
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirm({ statut: choix, commentaire })}
            disabled={loading}
          >
            {loading ? 'En cours...' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== MODAL VERSEMENT =====
function ModalVersement({ onConfirm, onCancel, loading }) {
  const [form, setForm] = useState({
    montant:        '',
    date_versement: new Date().toISOString().split('T')[0],
    reference:      '',
    notes:          '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Enregistrer un versement</div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Montant (FCFA) *</label>
          <input
            className={styles.finput}
            type="number"
            min="1"
            value={form.montant}
            onChange={e => set('montant', e.target.value)}
            placeholder="Ex: 50000"
          />
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Date du versement *</label>
          <input
            className={styles.finput}
            type="date"
            value={form.date_versement}
            onChange={e => set('date_versement', e.target.value)}
          />
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Référence</label>
          <input
            className={styles.finput}
            type="text"
            value={form.reference}
            onChange={e => set('reference', e.target.value)}
            placeholder="N° reçu, virement..."
          />
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Notes</label>
          <textarea
            className={styles.ftextarea}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Remarques éventuelles..."
          />
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onConfirm(form)}
            disabled={loading || !form.montant || !form.date_versement}
          >
            {loading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}


// ===== MODAL EDITION LIGNES =====
function ModalEditionLignes({ commande, onConfirm, onCancel, loading }) {
  const [lignes, setLignes] = useState(
    commande.lignes.map(l => ({
      id:            l.id,
      designation:   l.designation,
      quantite:      String(l.quantite),
      prix_unitaire: String(l.prix_unitaire),
    }))
  );

  const setLigne = (i, k, v) =>
    setLignes(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: v } : l));

  const ajouterLigne = () =>
    setLignes(ls => [...ls, { id: null, designation: '', quantite: '1', prix_unitaire: '0' }]);

  const supprimerLigne = (i) =>
    setLignes(ls => ls.filter((_, idx) => idx !== i));

  const brut = lignes.reduce((s, l) => s + (Number(l.quantite) * Number(l.prix_unitaire)), 0);
  const remise = brut * (commande.remise / 100);
  const netHT  = brut - remise;
  const tva    = commande.tva_applicable ? netHT * 0.18 : 0;
  const total  = netHT + tva;

  const valide = lignes.length > 0 && lignes.every(
    l => l.designation.trim() && Number(l.quantite) > 0 && Number(l.prix_unitaire) >= 0
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalLarge}>
        <div className={styles.modalTitle}>Modifier les lignes de commande</div>

        <div className={styles.lignesEditWrap}>
          <table className={styles.lignesTable}>
            <thead>
              <tr>
                <th style={{ width: '40%' }}>Désignation</th>
                <th style={{ width: '15%' }}>Qté</th>
                <th style={{ width: '20%' }}>Prix unitaire</th>
                <th style={{ width: '20%' }}>Sous-total</th>
                <th style={{ width: '5%'  }}></th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((l, i) => (
                <tr key={i}>
                  <td>
                    <input
                      className={styles.finput}
                      value={l.designation}
                      onChange={e => setLigne(i, 'designation', e.target.value)}
                      placeholder="Désignation..."
                    />
                  </td>
                  <td>
                    <input
                      className={styles.finput}
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={l.quantite}
                      onChange={e => setLigne(i, 'quantite', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.finput}
                      type="number"
                      min="0"
                      value={l.prix_unitaire}
                      onChange={e => setLigne(i, 'prix_unitaire', e.target.value)}
                    />
                  </td>
                  <td className={styles.sousTotal}>
                    {formatMontant(Number(l.quantite) * Number(l.prix_unitaire))}
                  </td>
                  <td>
                    <button
                      className={styles.btnSupprLigne}
                      onClick={() => supprimerLigne(i)}
                      disabled={lignes.length === 1}
                      title="Supprimer"
                    >×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className={styles.btnAjouterLigne} onClick={ajouterLigne}>
            + Ajouter une ligne
          </button>
        </div>

        {/* Récap */}
        <div className={styles.editRecap}>
          <div className={styles.editRecapRow}>
            <span>Montant brut</span>
            <span>{formatMontant(brut)}</span>
          </div>
          {commande.remise > 0 && (
            <div className={styles.editRecapRow}>
              <span>Remise ({commande.remise}%)</span>
              <span>− {formatMontant(remise)}</span>
            </div>
          )}
          {commande.tva_applicable && (
            <div className={styles.editRecapRow}>
              <span>TVA (18%)</span>
              <span>+ {formatMontant(tva)}</span>
            </div>
          )}
          <div className={`${styles.editRecapRow} ${styles.editRecapTotal}`}>
            <span>Total TTC</span>
            <span>{formatMontant(total)}</span>
          </div>
        </div>

        <div className={styles.modalActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
          <Button
            variant="primary"
            size="sm"
            disabled={loading || !valide}
            onClick={() => onConfirm({ lignes: lignes.map(l => ({ ...l, id: l.id || undefined })) })}
          >
            {loading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function CommandeDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
  const [modalDoc, setModalDoc] = useState(null); // 'PRO_FORMA' | 'FACTURE' | null


  const [commande, setCommande]         = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [modalStatut, setModalStatut]   = useState(false);
  const [modalVers, setModalVers]       = useState(false);
  const [modalEdition, setModalEdition] = useState(false);
  const [actionLoading, setActionLoad]  = useState(false);

  const fetchCommande = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/commandes/${id}`);
      setCommande(data);
    } catch {
      setError('Commande introuvable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCommande(); }, [id]);

  const handleChangerStatut = async (payload) => {
    setActionLoad(true);
    try {
      await api.patch(`/commandes/${id}/statut`, payload);
      setModalStatut(false);
      await fetchCommande();
    } catch {
      alert('Erreur lors du changement de statut.');
    } finally {
      setActionLoad(false);
    }
  };

  const handleVersement = async (payload) => {
    setActionLoad(true);
    try {
      await api.post(`/commandes/${id}/versements`, payload);
      setModalVers(false);
      await fetchCommande();
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      setActionLoad(false);
    }
  };

  const handleEditionLignes = async (payload) => {
    setActionLoad(true);
    try {
      await api.put(`/commandes/${id}`, payload);
      setModalEdition(false);
      await fetchCommande();
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de la modification.');
    } finally {
      setActionLoad(false);
    }
  };

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
        {/* Statuts */}
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

          {/* Infos générales */}
          <Section title="Informations">
            <div className={styles.infoGrid}>
              <InfoField label="Référence"  value={commande.reference} />
              <InfoField label="Service"    value={SERVICES_LABELS[commande.service]} />
              <InfoField label="Agent"      value={commande.agent?.nom_complet} />
              <InfoField label="Échéance"   value={formatDate(commande.date_echeance)} />
              <InfoField label="Remise"     value={commande.remise > 0 ? `${commande.remise}%` : 'Aucune'} />
              <InfoField label="TVA"        value={commande.tva_applicable ? 'Applicable (18%)' : 'Non applicable'} />
              <InfoField label="Créée le"   value={formatDate(commande.created_at)} />
            </div>
            {commande.notes && (
              <div className={styles.notes}>
                <div className={styles.infoLabel}>Notes</div>
                <div className={styles.notesText}>{commande.notes}</div>
              </div>
            )}
          </Section>

          {/* Client */}
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
                {commande.client?.email && (
                  <div className={styles.clientSub}>{commande.client.email}</div>
                )}
              </div>
            </div>
          </Section>

          {/* Historique */}
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
        </div>

        {/* Colonne droite */}
        <div className={styles.colRight}>

          {/* Lignes commande */}
          <Section
              title="Lignes de commande"
              action={
                commande.statut !== 'ANNULE' && (
                  <Button variant="outline" size="sm" onClick={() => setModalEdition(true)}>
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
                      <td colSpan={3}>Remise ({commande.remise}%)</td>
                      <td>
                        − {formatMontant(
                          commande.lignes?.reduce((s, l) => s + Number(l.sous_total), 0)
                          * commande.remise / 100
                        )}
                      </td>
                    </tr>
                  )}
                  {commande.tva_applicable && (
                    <tr className={styles.tfootRow}>
                      <td colSpan={3}>TVA (18%)</td>
                      <td>
                        + {formatMontant(
                          commande.lignes?.reduce((s, l) => s + Number(l.sous_total), 0)
                          * (1 - commande.remise / 100) * 0.18
                        )}
                      </td>
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

          {/* Versements */}
          <Section
            title="Versements"
            action={
              commande.statut !== 'ANNULE' && commande.statut_paiement !== 'PAYE' && (
                <Button variant="outline" size="sm" onClick={() => setModalVers(true)}>
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
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className={styles.tfootTotal}>
                      <td colSpan={3}>Total payé</td>
                      <td>{formatMontant(commande.montant_paye)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className={styles.emptyMsg}>Aucun versement enregistré.</div>
            )}
          </Section>

        </div>
      </div>

      {/* Modals */}
      {modalStatut && (
        <ModalStatut
          statut={commande.statut}
          onConfirm={handleChangerStatut}
          onCancel={() => setModalStatut(false)}
          loading={actionLoading}
        />
      )}
      {modalVers && (
        <ModalVersement
          onConfirm={handleVersement}
          onCancel={() => setModalVers(false)}
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
          onConfirm={handleEditionLignes}
          onCancel={() => setModalEdition(false)}
          loading={actionLoading}
        />
      )}

    </AppLayout>
  );
}
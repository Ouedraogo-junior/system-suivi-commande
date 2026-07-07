// src/components/dashboard/commandedetail/ModalsCommande.jsx
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import styles from '../../../pages/dashboard/CommandeDetailPage.module.css';
import { STATUTS_SUIVANTS, STATUTS_LABELS, formatMontant, calculerMontantRemise } from './useCommandeDetail';

// ===== MODAL STATUT =====
export function ModalStatut({ statut, onConfirm, onCancel, loading }) {
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
export function ModalVersement({ montantRestant, onConfirm, onCancel, loading }) {
  const [form, setForm] = useState({
    montant:        '',
    date_versement: new Date().toISOString().split('T')[0],
    reference:      '',
    notes:          '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const montantSaisi = Number(form.montant) || 0;
  const depasse = montantSaisi > montantRestant;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Enregistrer un versement</div>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Montant (FCFA) *</label>
          <div style={{ fontSize: '0.85em', color: '#666', marginBottom: 4 }}>
            Reste à payer : {formatMontant(montantRestant)}
          </div>
          <input
            className={styles.finput}
            type="number"
            min="1"
            max={montantRestant}
            value={form.montant}
            onChange={e => set('montant', e.target.value)}
            placeholder="Ex: 50000"
          />
          {depasse && (
            <div style={{ fontSize: '0.85em', color: '#c0392b', marginTop: 4 }}>
              Le montant dépasse le reste à payer ({formatMontant(montantRestant)}).
            </div>
          )}
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
            disabled={loading || !form.montant || !form.date_versement || depasse}
          >
            {loading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== MODAL EDITION VERSEMENT =====
export function ModalVersementEdit({ versement, onConfirm, onCancel, loading }) {
  const [form, setForm] = useState({
    montant:   String(versement.montant),
    reference: versement.reference ?? '',
    notes:     versement.notes ?? '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Modifier le versement #{versement.numero_versement}</div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Montant (FCFA) *</label>
          <input
            className={styles.finput}
            type="number"
            min="1"
            value={form.montant}
            onChange={e => set('montant', e.target.value)}
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
            disabled={loading || !form.montant}
          >
            {loading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== MODAL EDITION LIGNES =====
export function ModalEditionLignes({ commande, onConfirm, onCancel, loading }) {
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

  const brut  = lignes.reduce((s, l) => s + (Number(l.quantite) * Number(l.prix_unitaire)), 0);
  const remise = calculerMontantRemise(brut, commande);
  const netHT  = brut - remise;
  const tva    = commande.tva_applicable ? netHT * ((commande.tva_taux ?? 18) / 100) : 0;
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
              <span>Remise ({commande.remise_type === 'MONTANT' ? formatMontant(commande.remise) : `${commande.remise}%`})</span>
              <span>− {formatMontant(remise)}</span>
            </div>
          )}
          {commande.tva_applicable && (
            <div className={styles.editRecapRow}>
              <span>TVA ({commande.tva_taux ?? 18}%)</span>
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

// ===== MODAL EDITION INFOS (remise / TVA / échéance) =====
export function ModalEditionInfos({ commande, onConfirm, onCancel, loading }) {
  const brut = commande.lignes?.reduce((s, l) => s + Number(l.sous_total), 0) || 0;

  const [form, setForm] = useState({
    remise:         String(commande.remise ?? 0),
    remiseType:     commande.remise_type ?? 'PERCENT',
    tva_applicable: !!commande.tva_applicable,
    tva_taux:       String(commande.tva_taux ?? 18),
    date_echeance:  commande.date_echeance ? commande.date_echeance.split('T')[0] : '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const remiseValide = form.remise === '' || (
    form.remiseType === 'PERCENT'
      ? (Number(form.remise) >= 0 && Number(form.remise) <= 100)
      : (Number(form.remise) >= 0 && Number(form.remise) <= brut)
  );
  const tvaTauxValide = !form.tva_applicable || (form.tva_taux !== '' && Number(form.tva_taux) >= 0 && Number(form.tva_taux) <= 100);
  const valide = remiseValide && tvaTauxValide;

  const handleConfirm = () => {

    onConfirm({
      remise:         Number(form.remise) || 0,
      remise_type:    form.remiseType,
      tva_applicable: form.tva_applicable,
      tva_taux:       form.tva_applicable ? Number(form.tva_taux) : 0,
      date_echeance:  form.date_echeance || null,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Modifier les informations</div>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Remise</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              className={styles.finput}
              type="number"
              min="0"
              max={form.remiseType === 'PERCENT' ? 100 : undefined}
              value={form.remise}
              onChange={e => set('remise', e.target.value)}
            />
            <select
              className={styles.fselect}
              value={form.remiseType}
              onChange={e => { set('remiseType', e.target.value); set('remise', ''); }}
            >
              <option value="PERCENT">%</option>
              <option value="MONTANT">Montant</option>
            </select>
          </div>
        </div>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>
            <input
              type="checkbox"
              checked={form.tva_applicable}
              onChange={e => set('tva_applicable', e.target.checked)}
            />
            {' '}TVA applicable
          </label>
        </div>

        {form.tva_applicable && (
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Taux TVA (%)</label>
            <input
              className={styles.finput}
              type="number"
              min="0"
              max="100"
              value={form.tva_taux}
              onChange={e => set('tva_taux', e.target.value)}
            />
          </div>
        )}

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Échéance</label>
          <input
            className={styles.finput}
            type="date"
            value={form.date_echeance}
            onChange={e => set('date_echeance', e.target.value)}
          />
        </div>

        <div className={styles.modalActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
          <Button variant="primary" size="sm" onClick={handleConfirm} disabled={loading || !valide}>
            {loading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
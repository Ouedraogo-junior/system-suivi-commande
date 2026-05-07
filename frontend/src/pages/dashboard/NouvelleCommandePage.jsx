import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import api from '../../lib/axios';
import styles from './NouvelleCommandePage.module.css';

// ===== CONSTANTES =====
const SERVICES = [
  { value: 'IMPRIMERIE',   label: 'Imprimerie Générale' },
  { value: 'INFORMATIQUE', label: 'Fournitures Informatiques' },
  { value: 'NEGOCE',       label: 'Négoce International' },
  { value: 'AMENAGEMENT',  label: 'Aménagement' },
];

// ===== LIGNE VIDE =====
const nouvelleLigne = () => ({
  _key:         Math.random(),
  designation:  '',
  quantite:     '',
  prix_unitaire: '',
});

// ===== HELPERS =====
function calcSousTotal(l) {
  const q = parseFloat(l.quantite) || 0;
  const p = parseFloat(l.prix_unitaire) || 0;
  return q * p;
}

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

// ===== RECHERCHE CLIENT =====
function ClientSearch({ value, onChange, onSelect }) {
  const [results, setResults]   = useState([]);
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleInput = async (e) => {
    const q = e.target.value;
    onChange(q);
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const { data } = await api.get('/clients', { params: { search: q } });
      setResults(data.data ?? []);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (client) => {
    onSelect(client);
    setOpen(false);
  };

  return (
    <div className={styles.clientSearch}>
      <input
        className={styles.finput}
        type="text"
        placeholder="Nom, téléphone..."
        value={value}
        onChange={handleInput}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        autoComplete="off"
      />
      {loading && <div className={styles.clientLoading}>Recherche...</div>}
      {open && results.length > 0 && (
        <div className={styles.clientDropdown}>
          {results.map((c) => (
            <div
              key={c.id}
              className={styles.clientOption}
              onMouseDown={() => handleSelect(c)}
            >
              <div className={styles.clientOptionName}>{c.nom_complet}</div>
              {c.telephone && (
                <div className={styles.clientOptionSub}>{c.telephone}</div>
              )}
            </div>
          ))}
        </div>
      )}
      {open && results.length === 0 && !loading && (
        <div className={styles.clientDropdown}>
          <div className={styles.clientOptionEmpty}>Aucun client trouvé.</div>
        </div>
      )}
    </div>
  );
}

// ===== MODAL NOUVEAU CLIENT =====
function ModalNouveauClient({ onConfirm, onCancel, loading }) {
  const [form, setForm] = useState({
    nom_complet: '', telephone: '', email: '', adresse: '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Nouveau client</div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Nom complet *</label>
          <input className={styles.finput} value={form.nom_complet}
            onChange={e => set('nom_complet', e.target.value)}
            placeholder="Ex: Kaboré Jean" />
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Téléphone</label>
          <input className={styles.finput} value={form.telephone}
            onChange={e => set('telephone', e.target.value)}
            placeholder="Ex: 70000000" />
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Email</label>
          <input className={styles.finput} type="email" value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="Ex: jean@email.com" />
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Adresse</label>
          <input className={styles.finput} value={form.adresse}
            onChange={e => set('adresse', e.target.value)}
            placeholder="Ex: Ouagadougou, secteur 15" />
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
          <Button
            variant="primary" size="sm"
            onClick={() => onConfirm(form)}
            disabled={loading || !form.nom_complet.trim()}
          >
            {loading ? 'En cours...' : 'Créer le client'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function NouvelleCommandePage() {
  const navigate = useNavigate();

  // Client
  const [clientSearch, setClientSearch]   = useState('');
  const [clientSelectionne, setClient]    = useState(null);
  const [showModalClient, setShowModal]   = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  // Commande
  const [service, setService]             = useState('IMPRIMERIE');
  const [remise, setRemise]               = useState('');
  const [tva, setTva]                     = useState(false);
  const [dateEcheance, setDateEcheance]   = useState('');
  const [notes, setNotes]                 = useState('');
  const [lignes, setLignes]               = useState([nouvelleLigne()]);

  // Soumission
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  // ── Lignes ────────────────────────────────────────────
  const updateLigne = (key, field, val) => {
    setLignes(ls => ls.map(l => l._key === key ? { ...l, [field]: val } : l));
  };

  const ajouterLigne = () => setLignes(ls => [...ls, nouvelleLigne()]);

  const supprimerLigne = (key) => {
    if (lignes.length === 1) return;
    setLignes(ls => ls.filter(l => l._key !== key));
  };

  // ── Calculs ───────────────────────────────────────────
  const sousTotal   = lignes.reduce((s, l) => s + calcSousTotal(l), 0);
  const apresRemise = sousTotal * (1 - (parseFloat(remise) || 0) / 100);
  const montantTVA  = tva ? apresRemise * 0.18 : 0;
  const total       = apresRemise + montantTVA;

  // ── Créer client ──────────────────────────────────────
  const handleCreerClient = async (form) => {
    if (!form.nom_complet.trim()) return;
    setClientLoading(true);
    try {
      const { data } = await api.post('/clients', form);
      setClient(data);
      setClientSearch(data.nom_complet);
      setShowModal(false);
    } catch {
      alert('Erreur lors de la création du client.');
    } finally {
      setClientLoading(false);
    }
  };

  // ── Validation ────────────────────────────────────────
  const valider = () => {
    const e = {};
    if (!clientSelectionne) e.client = 'Sélectionnez un client.';
    lignes.forEach((l, i) => {
      if (!l.designation.trim())           e[`lig_${i}_des`] = 'Désignation requise.';
      if (!l.quantite || l.quantite <= 0)  e[`lig_${i}_qte`] = 'Quantité invalide.';
      if (!l.prix_unitaire || l.prix_unitaire < 0) e[`lig_${i}_pu`] = 'Prix invalide.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Soumettre ─────────────────────────────────────────
  const handleSubmit = async () => {
    if (!valider()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/commandes', {
        client_id:      clientSelectionne.id,
        service,
        remise:         parseFloat(remise) || 0,
        tva_applicable: tva,
        date_echeance:  dateEcheance || null,
        notes:          notes || null,
        lignes: lignes.map((l, i) => ({
          designation:   l.designation,
          quantite:      parseFloat(l.quantite),
          prix_unitaire: parseFloat(l.prix_unitaire),
          ordre:         i + 1,
        })),
      });
      navigate(`/dashboard/commandes/${data.id}`);
    } catch (e) {
      const msg = e.response?.data?.message ?? 'Erreur lors de la création.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Rendu ─────────────────────────────────────────────
  return (
    <AppLayout
      title="Nouvelle commande"
      subtitle="Espace agent"
      topbarActions={
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          ← Retour
        </Button>
      }
    >
      <div className={styles.layout}>
        {/* ── Colonne principale ── */}
        <div className={styles.colMain}>

          {/* Client */}
          <div className={styles.card}>
            <div className={styles.cardHead}>Client</div>
            <div className={styles.cardBody}>
              {clientSelectionne ? (
                <div className={styles.clientSelected}>
                  <div className={styles.clientSelectedInfo}>
                    <div className={styles.clientSelectedName}>
                      {clientSelectionne.nom_complet}
                    </div>
                    {clientSelectionne.telephone && (
                      <div className={styles.clientSelectedSub}>
                        {clientSelectionne.telephone}
                      </div>
                    )}
                  </div>
                  <button
                    className={styles.clientChangeBtn}
                    onClick={() => { setClient(null); setClientSearch(''); }}
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <div className={styles.clientRow}>
                  <ClientSearch
                    value={clientSearch}
                    onChange={setClientSearch}
                    onSelect={(c) => { setClient(c); setClientSearch(c.nom_complet); }}
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                    + Nouveau
                  </Button>
                </div>
              )}
              {errors.client && <div className={styles.fieldError}>{errors.client}</div>}
            </div>
          </div>

          {/* Lignes de commande */}
          <div className={styles.card}>
            <div className={styles.cardHead}>Lignes de commande</div>
            <div className={styles.cardBody}>
              <div className={styles.lignesHeader}>
                <span style={{ flex: 3 }}>Désignation</span>
                <span style={{ flex: 1 }}>Quantité</span>
                <span style={{ flex: 1.5 }}>Prix unitaire</span>
                <span style={{ flex: 1.5 }}>Sous-total</span>
                <span style={{ width: '28px' }} />
              </div>

              {lignes.map((l, i) => (
                <div key={l._key} className={styles.ligneRow}>
                  <div style={{ flex: 3 }}>
                    <input
                      className={`${styles.finput} ${errors[`lig_${i}_des`] ? styles.inputError : ''}`}
                      placeholder="Désignation..."
                      value={l.designation}
                      onChange={e => updateLigne(l._key, 'designation', e.target.value)}
                    />
                    {errors[`lig_${i}_des`] && (
                      <div className={styles.fieldError}>{errors[`lig_${i}_des`]}</div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      className={`${styles.finput} ${errors[`lig_${i}_qte`] ? styles.inputError : ''}`}
                      type="number" min="0" placeholder="0"
                      value={l.quantite}
                      onChange={e => updateLigne(l._key, 'quantite', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1.5 }}>
                    <input
                      className={`${styles.finput} ${errors[`lig_${i}_pu`] ? styles.inputError : ''}`}
                      type="number" min="0" placeholder="0"
                      value={l.prix_unitaire}
                      onChange={e => updateLigne(l._key, 'prix_unitaire', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1.5 }} className={styles.sousTotal}>
                    {formatMontant(calcSousTotal(l))}
                  </div>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => supprimerLigne(l._key)}
                    disabled={lignes.length === 1}
                    title="Supprimer la ligne"
                  >
                    ×
                  </button>
                </div>
              ))}

              <button className={styles.addLigneBtn} onClick={ajouterLigne}>
                + Ajouter une ligne
              </button>
            </div>
          </div>
        </div>

        {/* ── Colonne latérale ── */}
        <div className={styles.colSide}>

          {/* Paramètres */}
          <div className={styles.card}>
            <div className={styles.cardHead}>Paramètres</div>
            <div className={styles.cardBody}>
              <div className={styles.fgroup}>
                <label className={styles.flabel}>Service *</label>
                <select className={styles.fselect} value={service}
                  onChange={e => setService(e.target.value)}>
                  {SERVICES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.fgroup}>
                <label className={styles.flabel}>Remise (%)</label>
                <input className={styles.finput} type="number"
                  min="0" max="100" placeholder="0"
                  value={remise} onChange={e => setRemise(e.target.value)} />
              </div>
              <div className={styles.fgroup}>
                <label className={styles.flabel}>Date d'échéance</label>
                <input className={styles.finput} type="date"
                  value={dateEcheance} onChange={e => setDateEcheance(e.target.value)} />
              </div>
              <div className={styles.fgroup}>
                <label className={styles.checkLabel}>
                  <input type="checkbox" checked={tva}
                    onChange={e => setTva(e.target.checked)} />
                  TVA applicable (18%)
                </label>
              </div>
              <div className={styles.fgroup}>
                <label className={styles.flabel}>Notes</label>
                <textarea className={styles.ftextarea}
                  placeholder="Remarques internes..."
                  value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className={styles.card}>
            <div className={styles.cardHead}>Récapitulatif</div>
            <div className={styles.cardBody}>
              <div className={styles.recapRow}>
                <span>Sous-total</span>
                <span>{formatMontant(sousTotal)}</span>
              </div>
              {parseFloat(remise) > 0 && (
                <div className={styles.recapRow}>
                  <span>Remise ({remise}%)</span>
                  <span>− {formatMontant(sousTotal * parseFloat(remise) / 100)}</span>
                </div>
              )}
              {tva && (
                <div className={styles.recapRow}>
                  <span>TVA (18%)</span>
                  <span>+ {formatMontant(montantTVA)}</span>
                </div>
              )}
              <div className={styles.recapTotal}>
                <span>Total</span>
                <span>{formatMontant(total)}</span>
              </div>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Créer la commande'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showModalClient && (
        <ModalNouveauClient
          onConfirm={handleCreerClient}
          onCancel={() => setShowModal(false)}
          loading={clientLoading}
        />
      )}
    </AppLayout>
  );
}
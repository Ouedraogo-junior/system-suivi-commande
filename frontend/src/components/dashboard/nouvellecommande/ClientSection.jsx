// src/components/dashboard/nouvellecommande/ClientSection.jsx
import { useState } from 'react';
import Button from '../../ui/Button';
import api from '../../../lib/axios';
import styles from '../../../pages/dashboard/NouvelleCommandePage.module.css';

// ── Recherche client ──────────────────────────────────────────────────────────
function ClientSearch({ value, onChange, onSelect }) {
  const [results, setResults] = useState([]);
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);

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
              onMouseDown={() => { onSelect(c); setOpen(false); }}
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

// ── Modal nouveau client ──────────────────────────────────────────────────────
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

// ── Section client (export principal) ────────────────────────────────────────
export default function ClientSection({ clientSelectionne, onSelect, onDeselect, error }) {
  const [clientSearch, setClientSearch]   = useState('');
  const [showModal, setShowModal]         = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  const handleCreerClient = async (form) => {
    if (!form.nom_complet.trim()) return;
    setClientLoading(true);
    try {
      const { data } = await api.post('/clients', form);
      onSelect(data);
      setClientSearch(data.nom_complet);
      setShowModal(false);
    } catch {
      alert('Erreur lors de la création du client.');
    } finally {
      setClientLoading(false);
    }
  };

  const handleDeselect = () => {
    onDeselect();
    setClientSearch('');
  };

  return (
    <>
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
              <button className={styles.clientChangeBtn} onClick={handleDeselect}>
                Changer
              </button>
            </div>
          ) : (
            <div className={styles.clientRow}>
              <ClientSearch
                value={clientSearch}
                onChange={setClientSearch}
                onSelect={(c) => { onSelect(c); setClientSearch(c.nom_complet); }}
              />
              <Button variant="outline" size="sm" onClick={() => setShowModal(true)}>
                + Nouveau
              </Button>
            </div>
          )}
          {error && <div className={styles.fieldError}>{error}</div>}
        </div>
      </div>

      {showModal && (
        <ModalNouveauClient
          onConfirm={handleCreerClient}
          onCancel={() => setShowModal(false)}
          loading={clientLoading}
        />
      )}
    </>
  );
}
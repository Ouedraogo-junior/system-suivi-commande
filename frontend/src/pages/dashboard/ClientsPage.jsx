import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../lib/axios';
import styles from './ClientsPage.module.css';

// ===== HELPERS =====
function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ===== MODAL CRÉATION / ÉDITION CLIENT =====
function ModalClient({ client, onConfirm, onCancel, loading }) {
  const [form, setForm] = useState({
    nom_complet: client?.nom_complet ?? '',
    telephone:   client?.telephone  ?? '',
    fax:         client?.fax        ?? '',
    email:       client?.email      ?? '',
    adresse:     client?.adresse    ?? '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isEdit = !!client;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          {isEdit ? 'Modifier le client' : 'Nouveau client'}
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Nom complet *</label>
          <input className={styles.finput} value={form.nom_complet}
            onChange={e => set('nom_complet', e.target.value)}
            placeholder="Ex: Kaboré Jean" />
        </div>
        <div className={styles.fgrid}>
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Téléphone</label>
            <input className={styles.finput} value={form.telephone}
              onChange={e => set('telephone', e.target.value)}
              placeholder="Ex: 70000000" />
          </div>
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Fax</label>
            <input className={styles.finput} value={form.fax}
              onChange={e => set('fax', e.target.value)}
              placeholder="Ex: 25300000" />
          </div>
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
            {loading ? 'En cours...' : isEdit ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== PANNEAU DÉTAIL CLIENT =====
function PanneauDetail({ client, onEdit, onClose, onNouvelleCommande }) {
  if (!client) return null;

  return (
    <div className={styles.panneau}>
      <div className={styles.panneauHead}>
        <div className={styles.panneauTitre}>Détail client</div>
        <button className={styles.panneauClose} onClick={onClose}>×</button>
      </div>
      <div className={styles.panneauBody}>
        {/* Avatar + nom */}
        <div className={styles.clientHero}>
          <div className={styles.clientAvLg}>{getInitiales(client.nom_complet)}</div>
          <div>
            <div className={styles.clientHeroName}>{client.nom_complet}</div>
            <div className={styles.clientHeroSub}>
              {client.commandes_count ?? 0} commande{(client.commandes_count ?? 0) > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Infos */}
        <div className={styles.detailGrid}>
          <div className={styles.detailField}>
            <div className={styles.detailLabel}>Téléphone</div>
            <div className={styles.detailValue}>{client.telephone ?? '—'}</div>
          </div>
          <div className={styles.detailField}>
            <div className={styles.detailLabel}>Fax</div>
            <div className={styles.detailValue}>{client.fax ?? '—'}</div>
          </div>
          <div className={styles.detailField}>
            <div className={styles.detailLabel}>Email</div>
            <div className={styles.detailValue}>{client.email ?? '—'}</div>
          </div>
          <div className={styles.detailField}>
            <div className={styles.detailLabel}>Adresse</div>
            <div className={styles.detailValue}>{client.adresse ?? '—'}</div>
          </div>
          <div className={styles.detailField}>
            <div className={styles.detailLabel}>Ajouté le</div>
            <div className={styles.detailValue}>{formatDate(client.created_at)}</div>
          </div>
        </div>

        {/* Dernières commandes */}
        {client.commandes?.length > 0 && (
          <div className={styles.dernieresCommandes}>
            <div className={styles.dernieresTitre}>Dernières commandes</div>
            {client.commandes.map(c => (
              <div key={c.id} className={styles.commandeItem}>
                <span className={styles.commandeRef}>{c.reference}</span>
                <Badge type={c.statut} />
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className={styles.panneauActions}>
          <Button variant="outline" size="sm" fullWidth onClick={onEdit}>
            Modifier
          </Button>
          <Button variant="primary" size="sm" fullWidth onClick={onNouvelleCommande}>
            + Nouvelle commande
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function ClientsPage() {
  const navigate = useNavigate();

  const [clients, setClients]           = useState([]);
  const [meta, setMeta]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [page, setPage]                 = useState(1);

  const [clientActif, setClientActif]   = useState(null); // panneau détail
  const [modalClient, setModalClient]   = useState(null); // null | 'create' | client (edit)
  const [saveLoading, setSaveLoading]   = useState(false);

  // ── Fetch ─────────────────────────────────────────────
  const fetchClients = useCallback(async () => {
  setLoading(true);
  try {
    const { data } = await api.get('/clients', {
      params: { search: search || undefined, page },
    });
    setClients(data.data);
    setMeta(data.meta);
  } catch (e) {
    console.error('Erreur fetch clients:', e.response?.status, e.response?.data);
  } finally {
    setLoading(false);
  }
}, [search, page]);
  useEffect(() => { fetchClients(); }, [fetchClients]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search]);

  // ── Fetch détail client (avec commandes) ──────────────
  const ouvrirDetail = async (client) => {
    try {
      const { data } = await api.get(`/clients/${client.id}`);
      setClientActif(data);
    } catch {
      setClientActif(client);
    }
  };

  // ── Création / édition ────────────────────────────────
  const handleSave = async (form) => {
    if (!form.nom_complet.trim()) return;
    setSaveLoading(true);
    try {
      if (modalClient === 'create') {
        await api.post('/clients', form);
      } else {
        await api.put(`/clients/${modalClient.id}`, form);
        // Refresh panneau si client actif
        if (clientActif?.id === modalClient.id) {
          const { data } = await api.get(`/clients/${modalClient.id}`);
          setClientActif(data);
        }
      }
      setModalClient(null);
      fetchClients();
    } catch {
      alert('Erreur lors de l\'enregistrement.');
    } finally {
      setSaveLoading(false);
    }
  };

  // ── Rendu ─────────────────────────────────────────────
  return (
    <AppLayout
      title="Clients"
      subtitle={meta ? `${meta.total} client${meta.total > 1 ? 's' : ''}` : ''}
      topbarActions={
        <Button variant="primary" size="sm" onClick={() => setModalClient('create')}>
          + Nouveau client
        </Button>
      }
    >
      <div className={`${styles.layout} ${clientActif ? styles.withPanneau : ''}`}>
        {/* ── Zone principale ── */}
        <div className={styles.main}>
          {/* Recherche */}
          <div className={styles.toolbar}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Rechercher par nom, téléphone, email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Tableau */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Téléphone</th>
                  <th>Fax</th>
                  <th>Email</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Commandes</th>
                  <th>Ajouté le</th>
                  <th style={{ width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>Chargement...</td>
                  </tr>
                ) : clients.length > 0 ? (
                  clients.map(c => (
                    <tr
                      key={c.id}
                      className={clientActif?.id === c.id ? styles.rowActif : ''}
                      onClick={() => ouvrirDetail(c)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>
                        <div className={styles.clientCell}>
                          <div className={styles.clientAv}>{getInitiales(c.nom_complet)}</div>
                          <span className={styles.clientNom}>{c.nom_complet}</span>
                        </div>
                      </td>
                      <td className={styles.muted}>{c.telephone ?? '—'}</td>
                      <td className={styles.muted}>{c.fax ?? '—'}</td>
                      <td className={styles.muted}>{c.email ?? '—'}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={styles.countBadge}>
                          {c.commandes_count ?? 0}
                        </span>
                      </td>
                      <td className={styles.muted}>{formatDate(c.created_at)}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <button
                          className={styles.actBtn}
                          title="Modifier"
                          onClick={() => setModalClient(c)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>
                      Aucun client trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
              <div className={styles.pagination}>
                <span className={styles.paginInfo}>
                  {meta.from}–{meta.to} sur {meta.total}
                </span>
                <div className={styles.paginBtns}>
                  <button className={styles.paginBtn}
                    disabled={meta.current_page === 1}
                    onClick={() => setPage(p => p - 1)}>
                    ← Précédent
                  </button>
                  <span className={styles.paginCurrent}>
                    {meta.current_page} / {meta.last_page}
                  </span>
                  <button className={styles.paginBtn}
                    disabled={meta.current_page === meta.last_page}
                    onClick={() => setPage(p => p + 1)}>
                    Suivant →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Panneau détail ── */}
        <PanneauDetail
          client={clientActif}
          onClose={() => setClientActif(null)}
          onEdit={() => { setModalClient(clientActif); }}
          onNouvelleCommande={() =>
            navigate('/dashboard/commandes/nouvelle', {
              state: { client: clientActif },
            })
          }
        />
      </div>

      {/* Modal création / édition */}
      {modalClient && (
        <ModalClient
          client={modalClient === 'create' ? null : modalClient}
          onConfirm={handleSave}
          onCancel={() => setModalClient(null)}
          loading={saveLoading}
        />
      )}
    </AppLayout>
  );
}
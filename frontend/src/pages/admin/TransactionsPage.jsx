import { useState, useEffect, useCallback } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
// import Badge from '../../components/ui/Badge';
import api from '../../lib/axios';
import styles from './TransactionsPage.module.css';

// ===== HELPERS =====
function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const MOIS_OPTIONS = [
  { value: 1,  label: 'Janvier'   }, { value: 2,  label: 'Février'   },
  { value: 3,  label: 'Mars'      }, { value: 4,  label: 'Avril'     },
  { value: 5,  label: 'Mai'       }, { value: 6,  label: 'Juin'      },
  { value: 7,  label: 'Juillet'   }, { value: 8,  label: 'Août'      },
  { value: 9,  label: 'Septembre' }, { value: 10, label: 'Octobre'   },
  { value: 11, label: 'Novembre'  }, { value: 12, label: 'Décembre'  },
];

const CATEGORIES_ENTREE = [
  'Paiement commande', 'Acompte client', 'Remboursement',
  'Subvention', 'Autre entrée',
];

const CATEGORIES_SORTIE = [
  'Loyer', 'Salaires', 'Fournisseur', 'Charges fixes',
  'Achat matériel', 'Transport', 'Autre sortie',
];

// ===== BARRE STATS =====
function StatsBar({ stats, loading }) {
  if (loading || !stats) return <div className={styles.statsBar} />;

  return (
    <div className={styles.statsBar}>
      <div className={`${styles.statCard} ${styles.statEntree}`}>
        <div className={styles.statLabel}>Entrées</div>
        <div className={styles.statValue}>{formatMontant(stats.entrees)}</div>
      </div>
      <div className={`${styles.statCard} ${styles.statSortie}`}>
        <div className={styles.statLabel}>Sorties</div>
        <div className={styles.statValue}>{formatMontant(stats.sorties)}</div>
      </div>
      <div className={`${styles.statCard} ${styles.statSolde} ${stats.solde < 0 ? styles.statSoldeNeg : ''}`}>
        <div className={styles.statLabel}>Solde net</div>
        <div className={styles.statValue}>
          {stats.solde >= 0 ? '+' : ''}{formatMontant(stats.solde)}
        </div>
      </div>
      {/* Mini graphique évolution */}
      <div className={styles.statEvo}>
        <div className={styles.statLabel}>Évolution 6 mois</div>
        <div className={styles.miniBar}>
          {stats.evolution?.map((e, i) => {
            const max = Math.max(...stats.evolution.map(x => x.entrees), 1);
            const h   = Math.round((e.entrees / max) * 40);
            return (
              <div key={i} className={styles.miniBarCol}>
                <div className={styles.miniBarFill} style={{ height: `${Math.max(h, 2)}px` }} />
                <span className={styles.miniBarLabel}>{e.mois}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===== MODAL NOUVELLE TRANSACTION =====
function ModalTransaction({ onConfirm, onCancel, loading }) {
  const [form, setForm] = useState({
    type:             'ENTREE',
    categorie:        '',
    montant:          '',
    date_transaction: new Date().toISOString().split('T')[0],
    description:      '',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const categories = form.type === 'ENTREE' ? CATEGORIES_ENTREE : CATEGORIES_SORTIE;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>Nouvelle transaction</div>

        {/* Type */}
        <div className={styles.typeToggle}>
          <button
            className={`${styles.typeBtn} ${form.type === 'ENTREE' ? styles.typeBtnEntree : ''}`}
            onClick={() => set('type', 'ENTREE')}
          >
            ↑ Entrée
          </button>
          <button
            className={`${styles.typeBtn} ${form.type === 'SORTIE' ? styles.typeBtnSortie : ''}`}
            onClick={() => set('type', 'SORTIE')}
          >
            ↓ Sortie
          </button>
        </div>

        <div className={styles.fgrid}>
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Catégorie *</label>
            <select className={styles.fselect} value={form.categorie}
              onChange={e => set('categorie', e.target.value)}>
              <option value="">Sélectionner...</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Montant (FCFA) *</label>
            <input className={styles.finput} type="number" min="1"
              value={form.montant} onChange={e => set('montant', e.target.value)}
              placeholder="Ex: 150000" />
          </div>
        </div>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Date *</label>
          <input className={styles.finput} type="date"
            value={form.date_transaction}
            onChange={e => set('date_transaction', e.target.value)} />
        </div>

        <div className={styles.fgroup}>
          <label className={styles.flabel}>Description</label>
          <textarea className={styles.ftextarea}
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="Détail de la transaction..." />
        </div>

        <div className={styles.modalActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
          <Button variant="primary" size="sm"
            onClick={() => onConfirm(form)}
            disabled={loading || !form.categorie || !form.montant}>
            {loading ? 'En cours...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function TransactionsPage() {
  const now = new Date();

  const [mois, setMois]             = useState(now.getMonth() + 1);
  const [annee, setAnnee]           = useState(now.getFullYear());
  const [filtreType, setFiltreType] = useState(null); // null | ENTREE | SORTIE
  const [search, setSearch]         = useState('');
  const [page, setPage]             = useState(1);

  const [transactions, setTrans]    = useState([]);
  const [meta, setMeta]             = useState(null);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [statsLoading, setStatsL]   = useState(true);
  const [modal, setModal]           = useState(false);
  const [saveLoading, setSave]      = useState(false);

  // ── Fetch stats ───────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsL(true);
    try {
      const { data } = await api.get('/transactions/stats', {
        params: { mois, annee },
      });
      setStats(data);
    } finally {
      setStatsL(false);
    }
  }, [mois, annee]);

  // ── Fetch liste ───────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/transactions', {
        params: {
          mois,
          annee,
          type:   filtreType ?? undefined,
          search: search     || undefined,
          page,
        },
      });
      setTrans(data.data);
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  }, [mois, annee, filtreType, search, page]);

  useEffect(() => { fetchStats(); },        [fetchStats]);
  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);
  useEffect(() => { setPage(1); },          [mois, annee, filtreType, search]);

  // ── Créer transaction ─────────────────────────────────
  const handleSave = async (form) => {
    setSave(true);
    try {
      await api.post('/transactions', form);
      setModal(false);
      fetchStats();
      fetchTransactions();
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      setSave(false);
    }
  };

  // ── Supprimer ─────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette transaction ?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchStats();
      fetchTransactions();
    } catch {
      alert('Erreur lors de la suppression.');
    }
  };

  const annees = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

  return (
    <AppLayout
      title="Transactions"
      subtitle="Comptabilité — Entrées et sorties"
      topbarActions={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select className={styles.periodSelect} value={mois}
            onChange={e => setMois(Number(e.target.value))}>
            {MOIS_OPTIONS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select className={styles.periodSelect} value={annee}
            onChange={e => setAnnee(Number(e.target.value))}>
            {annees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <Button variant="primary" size="sm" onClick={() => setModal(true)}>
            + Nouvelle transaction
          </Button>
        </div>
      }
    >
      {/* Stats */}
      <StatsBar stats={stats} loading={statsLoading} />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filterBar}>
          {[
            { label: 'Toutes',  value: null      },
            { label: '↑ Entrées', value: 'ENTREE' },
            { label: '↓ Sorties', value: 'SORTIE' },
          ].map(f => (
            <button key={f.label}
              className={`${styles.filterBtn} ${filtreType === f.value ? styles.filterBtnOn : ''}`}
              onClick={() => setFiltreType(f.value)}>
              {f.label}
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Référence, catégorie..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tableau */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Référence</th>
              <th>Catégorie / Description</th>
              <th style={{ width: '100px' }}>Date</th>
              <th style={{ width: '80px'  }}>Type</th>
              <th style={{ width: '130px' }}>Montant</th>
              <th style={{ width: '50px'  }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className={styles.emptyRow}>Chargement...</td></tr>
            ) : transactions.length > 0 ? (
              transactions.map(t => (
                <tr key={t.id}>
                  <td><span className={styles.ref}>{t.reference}</span></td>
                  <td>
                    <div className={styles.descCell}>
                      <span className={styles.categorie}>{t.categorie}</span>
                      {t.description && (
                        <span className={styles.description}>{t.description}</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.muted}>{formatDate(t.date_transaction)}</td>
                  <td>
                    <span className={`${styles.typeBadge} ${t.type === 'ENTREE' ? styles.typeEntree : styles.typeSortie}`}>
                      {t.type === 'ENTREE' ? '↑ Entrée' : '↓ Sortie'}
                    </span>
                  </td>
                  <td className={`${styles.montant} ${t.type === 'ENTREE' ? styles.montantEntree : styles.montantSortie}`}>
                    {t.type === 'ENTREE' ? '+' : '−'} {formatMontant(t.montant)}
                  </td>
                  <td>
                    <button className={styles.deleteBtn}
                      title="Supprimer"
                      onClick={() => handleDelete(t.id)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className={styles.emptyRow}>Aucune transaction ce mois.</td></tr>
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
                onClick={() => setPage(p => p - 1)}>← Précédent</button>
              <span className={styles.paginCurrent}>
                {meta.current_page} / {meta.last_page}
              </span>
              <button className={styles.paginBtn}
                disabled={meta.current_page === meta.last_page}
                onClick={() => setPage(p => p + 1)}>Suivant →</button>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <ModalTransaction
          onConfirm={handleSave}
          onCancel={() => setModal(false)}
          loading={saveLoading}
        />
      )}
    </AppLayout>
  );
}
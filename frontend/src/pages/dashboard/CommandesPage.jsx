// src/pages/dashboard/CommandesPage.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useCommandes } from '../../hooks/useCommandes';
import styles from './CommandesPage.module.css';

// ===== CONSTANTES =====
const FILTRES = [
  { label: 'Toutes',     statut: null },
  { label: 'En attente', statut: 'EN_ATTENTE' },
  { label: 'En cours',   statut: 'EN_COURS' },
  { label: 'Terminées',  statut: 'TERMINE' },
  { label: 'Annulées',   statut: 'ANNULE' },
];

const SERVICES_LABELS = {
  IMPRIMERIE:   'Imprimerie',
  INFORMATIQUE: 'Informatique',
  NEGOCE:       'Négoce',
  AMENAGEMENT:  'Aménagement',
};

function formatMontant(montant) {
  return Number(montant).toLocaleString('fr-FR') + ' F';
}

function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ===== LIGNE TABLEAU =====
function CommandeRow({ cmd, onVoir }) {
  return (
    <tr>
      <td><span className={styles.ref}>{cmd.reference}</span></td>
      <td>
        <div className={styles.clientCell}>
          <div className={styles.clientAv}>
            {getInitiales(cmd.client?.nom_complet)}
          </div>
          <span>{cmd.client?.nom_complet}</span>
        </div>
      </td>

      <td>
        <div className={styles.clientCell}>
          <div className={styles.clientAv}>
            {getInitiales(cmd.agent?.nom_complet)}
          </div>
          <span>{cmd.agent?.nom_complet ?? '—'}</span>
        </div>
      </td>

      <td>
        <span className={styles.badgeSvc}>
          {SERVICES_LABELS[cmd.service] ?? cmd.service}
        </span>
      </td>
      <td className={styles.montant}>{formatMontant(cmd.montant_total)}</td>
      <td><Badge type={cmd.statut_paiement} /></td>
      <td><Badge type={cmd.statut} /></td>
      <td>
        <div className={styles.actions}>
          <button
            className={styles.actBtn}
            title="Voir le détail"
            onClick={() => onVoir(cmd.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

// ===== PAGINATION =====
function Pagination({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null;

  return (
    <div className={styles.pagination}>
      <span className={styles.paginfoText}>
        {meta.from}–{meta.to} sur {meta.total}
      </span>
      <div className={styles.paginBtns}>
        <button
          className={styles.paginBtn}
          disabled={meta.current_page === 1}
          onClick={() => onPage(meta.current_page - 1)}
        >
          ← Précédent
        </button>
        <span className={styles.paginCurrent}>
          Page {meta.current_page} / {meta.last_page}
        </span>
        <button
          className={styles.paginBtn}
          disabled={meta.current_page === meta.last_page}
          onClick={() => onPage(meta.current_page + 1)}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function CommandesPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';
  
  const [filtreActif, setFiltreActif] = useState(FILTRES[0]);
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(1);

  const { commandes, meta, loading, error, refetch } = useCommandes({
    statut: filtreActif.statut,
    search: search || undefined,
    page,
  });

  const handleFiltre = (f) => {
    setFiltreActif(f);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <AppLayout
      title="Commandes"
      subtitle="Liste des commandes"
      topbarActions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`${basePath}/commandes/nouvelle`)}>
          + Nouvelle commande
        </Button>
      }
    >
      {/* Barre filtres + recherche */}
      <div className={styles.toolbar}>
        <div className={styles.filterBar}>
          {FILTRES.map((f) => (
            <button
              key={f.label}
              className={`${styles.filterBtn} ${filtreActif.label === f.label ? styles.filterBtnOn : ''}`}
              onClick={() => handleFiltre(f)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Référence ou client..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Tableau */}
      <div className={styles.tableWrap}>
        {error && <div className={styles.errorMsg}>{error}</div>}

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Référence</th>
              <th style={{ width: '160px' }}>Client</th>
              <th style={{ width: '130px' }}>Agent</th>
              <th style={{ width: '120px' }}>Service</th>
              <th style={{ width: '120px' }}>Montant</th>
              <th style={{ width: '105px' }}>Paiement</th>
              <th style={{ width: '105px' }}>Statut</th>
              <th style={{ width: '60px'  }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  Chargement...
                </td>
              </tr>
            ) : commandes.length > 0 ? (
              commandes.map((c) => (
                <CommandeRow
                  key={c.id}
                  cmd={c}
                  onVoir={(id) => navigate(`${basePath}/commandes/${id}`)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination meta={meta} onPage={setPage} />
      </div>
    </AppLayout>
  );
}
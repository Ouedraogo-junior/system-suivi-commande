import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../lib/axios';
import styles from './DashboardPage.module.css';

// ===== HELPERS =====
const SERVICES_LABELS = {
  IMPRIMERIE:   'Imprimerie',
  INFORMATIQUE: 'Informatique',
  NEGOCE:       'Négoce',
  AMENAGEMENT:  'Aménagement',
};

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ===== CONSTANTES =====
const FILTRES = [
  { label: 'Toutes',     statut: null },
  { label: 'En attente', statut: 'EN_ATTENTE' },
  { label: 'En cours',   statut: 'EN_COURS' },
  { label: 'Terminées',  statut: 'TERMINE' },
];

// ===== METRIC CARD =====
function MetricCard({ label, value, sub, accent }) {
  return (
    <div className={`${styles.metric} ${styles[accent]}`}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value ?? '—'}</div>
      <div className={styles.metricSub}>{sub}</div>
    </div>
  );
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
        <span className={styles.badgeSvc}>
          {SERVICES_LABELS[cmd.service] ?? cmd.service}
        </span>
      </td>
      <td className={styles.montant}>{formatMontant(cmd.montant_total)}</td>
      <td><Badge type={cmd.statut_paiement} /></td>
      <td><Badge type={cmd.statut} /></td>
      <td>
        <button className={styles.actBtn} title="Voir" onClick={() => onVoir(cmd.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

// ===== PAGE =====
export default function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats]               = useState(null);
  const [commandes, setCommandes]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filtreActif, setFiltreActif]   = useState(FILTRES[0]);

  // ── Fetch stats + commandes récentes ─────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        // Commandes récentes (5 dernières) + toutes pour les stats
        const [recentes, toutes, enAttente, enCours, terminees] = await Promise.all([
          api.get('/commandes', { params: { page: 1, per_page: 5 } }),
          api.get('/commandes', { params: { per_page: 1 } }),
          api.get('/commandes', { params: { statut: 'EN_ATTENTE', per_page: 1 } }),
          api.get('/commandes', { params: { statut: 'EN_COURS',   per_page: 1 } }),
          api.get('/commandes', { params: { statut: 'TERMINE',    per_page: 1 } }),
        ]);

        setCommandes(recentes.data.data);
        setStats({
          total:     toutes.data.meta?.total     ?? 0,
          enAttente: enAttente.data.meta?.total  ?? 0,
          enCours:   enCours.data.meta?.total    ?? 0,
          terminees: terminees.data.meta?.total  ?? 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ── Filtrage local sur les 5 commandes affichées ─────
  const commandesFiltrees = filtreActif.statut
    ? commandes.filter(c => c.statut === filtreActif.statut)
    : commandes;

  return (
    <AppLayout
      title="Tableau de bord"
      subtitle="Espace agent"
      topbarActions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/dashboard/commandes/nouvelle')}
        >
          + Nouvelle commande
        </Button>
      }
    >
      {/* Métriques */}
      <div className={styles.metricsRow}>
        <MetricCard
          label="Total commandes"
          value={stats?.total}
          sub="Toutes périodes"
          accent="green"
        />
        <MetricCard
          label="En attente"
          value={stats?.enAttente}
          sub="À traiter"
          accent="amber"
        />
        <MetricCard
          label="En cours"
          value={stats?.enCours}
          sub="En traitement"
          accent="blue"
        />
        <MetricCard
          label="Terminées"
          value={stats?.terminees}
          sub="Toutes périodes"
          accent="green2"
        />
      </div>

      {/* En-tête section */}
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitle}>Commandes récentes</div>
        <div className={styles.filterBar}>
          {FILTRES.map((f) => (
            <button
              key={f.label}
              className={`${styles.filterBtn} ${filtreActif.label === f.label ? styles.filterBtnOn : ''}`}
              onClick={() => setFiltreActif(f)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Référence</th>
              <th style={{ width: '150px' }}>Client</th>
              <th style={{ width: '120px' }}>Service</th>
              <th style={{ width: '120px' }}>Montant</th>
              <th style={{ width: '100px' }}>Paiement</th>
              <th style={{ width: '100px' }}>Statut</th>
              <th style={{ width: '50px'  }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>Chargement...</td>
              </tr>
            ) : commandesFiltrees.length > 0 ? (
              commandesFiltrees.map(c => (
                <CommandeRow
                  key={c.id}
                  cmd={c}
                  onVoir={id => navigate(`/dashboard/commandes/${id}`)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  Aucune commande pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Lien vers la liste complète */}
        {!loading && commandes.length > 0 && (
          <div className={styles.tableFooter}>
            <button
              className={styles.voirToutBtn}
              onClick={() => navigate('/dashboard/commandes')}
            >
              Voir toutes les commandes →
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
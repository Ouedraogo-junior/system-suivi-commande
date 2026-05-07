import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import styles from './DashboardPage.module.css';

// ===== DONNÉES FICTIVES =====
const metrics = [
  { label: 'Total commandes', value: '47', sub: 'Ce mois',      accent: 'green'  },
  { label: 'En attente',      value: '12', sub: 'À traiter',    accent: 'amber'  },
  { label: 'En cours',        value: '18', sub: 'En traitement', accent: 'blue'  },
  { label: 'Terminées',       value: '17', sub: 'Ce mois',      accent: 'green2' },
];

const commandes = [
  { id: 1, ref: 'CMD-2025-0047', client: 'Bamba Soro',       initiales: 'BS', service: 'Imprimerie',  montant: '85 000 F',    paiement: 'NON_PAYE', statut: 'EN_COURS'   },
  { id: 2, ref: 'CMD-2025-0046', client: 'Aminata Traoré',   initiales: 'AT', service: 'Informatique', montant: '240 000 F',  paiement: 'PAYE',     statut: 'TERMINE'    },
  { id: 3, ref: 'CMD-2025-0045', client: 'Drissa Konaté',    initiales: 'DK', service: 'Négoce',      montant: '1 500 000 F', paiement: 'PARTIEL',  statut: 'EN_ATTENTE' },
  { id: 4, ref: 'CMD-2025-0044', client: 'Fatou Ouédraogo',  initiales: 'FO', service: 'Aménagement', montant: '680 000 F',   paiement: 'NON_PAYE', statut: 'ANNULE'     },
];

const FILTRES = ['Toutes', 'En attente', 'En cours', 'Terminées'];

const FILTRE_MAP = {
  'Toutes':     null,
  'En attente': 'EN_ATTENTE',
  'En cours':   'EN_COURS',
  'Terminées':  'TERMINE',
};

// ===== SOUS-COMPOSANTS =====
function MetricCard({ label, value, sub, accent }) {
  return (
    <div className={`${styles.metric} ${styles[accent]}`}>
      <div className={styles.metricLabel}>{label}</div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricSub}>{sub}</div>
    </div>
  );
}

function CommandeRow({ cmd }) {
  return (
    <tr>
      <td><span className={styles.ref}>{cmd.ref}</span></td>
      <td>
        <div className={styles.clientCell}>
          <div className={styles.clientAv}>{cmd.initiales}</div>
          <span>{cmd.client}</span>
        </div>
      </td>
      <td><span className={styles.badgeSvc}>{cmd.service}</span></td>
      <td className={styles.montant}>{cmd.montant}</td>
      <td><Badge type={cmd.paiement} /></td>
      <td><Badge type={cmd.statut} /></td>
      <td>
        <div className={styles.actions}>
          <button className={styles.actBtn} title="Voir">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
          <button className={styles.actBtn} title="Modifier">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}

function NouvelleCommandeForm({ onCancel }) {
  return (
    <div className={styles.formPanel}>
      <div className={styles.formTitle}>Nouvelle commande</div>
      <div className={styles.fgrid}>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Client</label>
          <select className={styles.fselect}>
            <option>Rechercher ou créer un client...</option>
          </select>
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Service</label>
          <select className={styles.fselect}>
            <option>Imprimerie Générale</option>
            <option>Fournitures informatiques</option>
            <option>Négoce International</option>
            <option>Aménagement</option>
          </select>
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Montant (FCFA)</label>
          <input className={styles.finput} type="text" placeholder="Ex: 150 000" />
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Date d'échéance</label>
          <input className={styles.finput} type="date" />
        </div>
      </div>
      <div className={styles.fgroup}>
        <label className={styles.flabel}>Description</label>
        <textarea className={styles.ftextarea} placeholder="Détail de la commande..." />
      </div>
      <div className={styles.fgroup}>
        <label className={styles.flabel}>Priorité</label>
        <div className={styles.fradioGroup}>
          <label className={styles.fradio}>
            <input type="radio" name="prio" defaultChecked /> Normale
          </label>
          <label className={styles.fradio}>
            <input type="radio" name="prio" /> Urgente
          </label>
        </div>
      </div>
      <div className={styles.formActions}>
        <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
        <Button variant="primary" size="sm">Enregistrer la commande</Button>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function DashboardPage() {
  const [filtreActif, setFiltreActif]   = useState('Toutes');
  const [showForm, setShowForm]         = useState(false);

  const commandesFiltrees = commandes.filter((c) => {
    const statut = FILTRE_MAP[filtreActif];
    return statut ? c.statut === statut : true;
  });

  return (
    <AppLayout
      title="Tableau de bord"
      subtitle="Espace agent"
      topbarActions={
        <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
          + Nouvelle commande
        </Button>
      }
    >
      {/* Métriques */}
      <div className={styles.metricsRow}>
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* En-tête section */}
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitle}>Commandes récentes</div>
        <div className={styles.filterBar}>
          {FILTRES.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filtreActif === f ? styles.filterBtnOn : ''}`}
              onClick={() => setFiltreActif(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '120px' }}>Référence</th>
              <th style={{ width: '140px' }}>Client</th>
              <th style={{ width: '120px' }}>Service</th>
              <th style={{ width: '110px' }}>Montant</th>
              <th style={{ width: '100px' }}>Paiement</th>
              <th style={{ width: '100px' }}>Statut</th>
              <th style={{ width: '80px'  }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commandesFiltrees.length > 0 ? (
              commandesFiltrees.map((c) => <CommandeRow key={c.id} cmd={c} />)
            ) : (
              <tr>
                <td colSpan={7} className={styles.emptyRow}>
                  Aucune commande pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulaire nouvelle commande */}
      {showForm && <NouvelleCommandeForm onCancel={() => setShowForm(false)} />}
    </AppLayout>
  );
}
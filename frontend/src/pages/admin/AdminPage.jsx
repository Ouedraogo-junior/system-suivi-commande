import AppLayout from '../../components/layout/AppLayout';
import MetricCard from '../../components/ui/MetricCard';
import { Card, CardHead, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import styles from './AdminPage.module.css';

// ===== DONNÉES FICTIVES =====
const metrics = [
  { label: 'Total entrées',          value: '3 820 000', tag: '+12% vs mars', tagType: 'up',      color: '#085041' },
  { label: 'Total sorties',          value: '1 245 000', tag: '+4% vs mars',  tagType: 'down',    color: '#791F1F' },
  { label: 'Solde net',              value: '2 575 000', tag: 'FCFA · Avril', tagType: 'neutral', color: '#1a5c2a' },
  { label: 'Commandes non soldées',  value: '8',         tag: '2 265 000 FCFA', tagType: 'warn',  color: '#633806' },
];

const transactions = [
  { id: 1, desc: 'Paiement CMD-2025-0046', cat: 'Paiement commande · Informatique', montant: '+240 000 F', type: 'in',  statut: 'VALIDE' },
  { id: 2, desc: 'Loyer bureau',           cat: 'Charges fixes · Avril',            montant: '−150 000 F', type: 'out', statut: 'VALIDE' },
  { id: 3, desc: 'Acompte CMD-2025-0045', cat: 'Paiement partiel · Négoce',         montant: '+500 000 F', type: 'in',  statut: 'EN_ATTENTE' },
  { id: 4, desc: 'Achat consommables',    cat: 'Fournisseur · Stock',               montant: '−85 000 F',  type: 'out', statut: 'VALIDE' },
  { id: 5, desc: 'Salaires — Avril',      cat: 'Charges salariales',               montant: '−620 000 F', type: 'out', statut: 'VALIDE' },
];

const barData = [
  { mois: 'Jan', h: 45, fill: false },
  { mois: 'Fév', h: 60, fill: true  },
  { mois: 'Mar', h: 38, fill: false },
  { mois: 'Avr', h: 75, fill: true  },
  { mois: 'Mai', h: 20, fill: false },
  { mois: 'Jun', h: 20, fill: false },
];

const agents = [
  { id: 1, initiales: 'KO', nom: 'Koné Oumar',       commandes: 18, actif: true  },
  { id: 2, initiales: 'SW', nom: 'Sawadogo Wend',     commandes: 22, actif: true  },
  { id: 3, initiales: 'DI', nom: 'Diallo Issouf',     commandes: 7,  actif: false },
];

// ===== SOUS-COMPOSANTS =====
function TransactionRow({ item }) {
  return (
    <div className={styles.financeRow}>
      <div className={styles.financeLeft}>
        <div className={`${styles.dot} ${item.type === 'in' ? styles.dotIn : styles.dotOut}`} />
        <div>
          <div className={styles.financeDesc}>{item.desc}</div>
          <div className={styles.financeCat}>{item.cat}</div>
        </div>
      </div>
      <div className={styles.financeRight}>
        <div className={item.type === 'in' ? styles.amountIn : styles.amountOut}>
          {item.montant}
        </div>
        <Badge
          type={item.statut === 'VALIDE' ? 'TERMINE' : 'EN_ATTENTE'}
          label={item.statut === 'VALIDE' ? 'Validé' : 'En attente'}
        />
      </div>
    </div>
  );
}

function AgentRow({ agent }) {
  return (
    <tr>
      <td>
        <div className={styles.agentCell}>
          <div className={styles.agAvatar}>{agent.initiales}</div>
          <span>{agent.nom}</span>
        </div>
      </td>
      <td>{agent.commandes}</td>
      <td>
        <div className={styles.statusCell}>
          <span className={`${styles.statusDot} ${agent.actif ? styles.dotActive : styles.dotInactive}`} />
          {agent.actif ? 'Actif' : 'Inactif'}
        </div>
      </td>
      <td>
        <Button variant={agent.actif ? 'ghost' : 'danger'} size="sm">
          {agent.actif ? 'Modifier' : 'Désactiver'}
        </Button>
      </td>
    </tr>
  );
}

// ===== PAGE =====
export default function AdminPage() {
  return (
    <AppLayout
      title="Comptabilité — Transactions"
      subtitle="Suivi des entrées et sorties · Avril 2025"
      topbarActions={
        <>
          <select className={styles.periodSelect}>
            <option>Avril 2025</option>
            <option>Mars 2025</option>
            <option>Année 2025</option>
          </select>
          <Button variant="primary" size="sm">+ Nouvelle transaction</Button>
        </>
      }
    >
      {/* Métriques */}
      <div className={styles.metricsRow}>
        {metrics.map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </div>

      {/* Deux colonnes */}
      <div className={styles.twoCol}>

        {/* Transactions récentes */}
        <Card>
          <CardHead title="Transactions récentes" badge="Avril 2025" />
          <CardBody>
            {transactions.map((t) => (
              <TransactionRow key={t.id} item={t} />
            ))}
            {/* Solde box */}
            <div className={styles.soldeBox}>
              <div>
                <div className={styles.soldeLabel}>Solde net · Avril 2025</div>
              </div>
              <div className={styles.soldeValue}>+ 2 575 000 FCFA</div>
            </div>
          </CardBody>
        </Card>

        {/* Colonne droite */}
        <div className={styles.rightCol}>

          {/* Graphique */}
          <Card>
            <CardHead title="Revenus par mois" badge="2025" />
            <CardBody>
              <div className={styles.barChart}>
                {barData.map((b) => (
                  <div key={b.mois} className={styles.barWrap}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${b.h}px`,
                        background: b.fill ? 'var(--green-dark)' : '#d6edd9',
                      }}
                    />
                    <span className={styles.barLabel}>{b.mois}</span>
                  </div>
                ))}
              </div>
              <div className={styles.barFooter}>
                <span>Entrées (FCFA)</span>
                <span>Mois courant : 3 820 000</span>
              </div>
            </CardBody>
          </Card>

          {/* Agents */}
          <Card>
            <CardHead
              title="Gestion des agents"
              badge="3 actifs"
              actions={<Button variant="outline" size="sm">+ Ajouter</Button>}
            />
            <CardBody noPadding>
              <table className={styles.agentsTable}>
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Commandes</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((a) => (
                    <AgentRow key={a.id} agent={a} />
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
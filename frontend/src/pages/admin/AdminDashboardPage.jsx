import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import MetricCard from '../../components/ui/MetricCard';
import { Card, CardHead, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../lib/axios';
import styles from './AdminPage.module.css';

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR');
}

function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ===== LIGNE AGENT =====
function AgentRow({ agent, onToggle, onEdit }) {
  return (
    <tr>
      <td>
        <div className={styles.agentCell}>
          <div className={styles.agAvatar}>{getInitiales(agent.nom_complet)}</div>
          <div>
            <div>{agent.nom_complet}</div>
            <div className={styles.agentPseudo}>@{agent.pseudo}</div>
          </div>
        </div>
      </td>
      <td>{agent.commandes_count ?? 0}</td>
      <td>
        <div className={styles.statusCell}>
          <span className={`${styles.statusDot} ${agent.actif ? styles.dotActive : styles.dotInactive}`} />
          {agent.actif ? 'Actif' : 'Inactif'}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', gap: '6px' }}>
          <Button variant="ghost" size="sm" onClick={() => onEdit(agent)}>
            Modifier
          </Button>
          <Button
            variant={agent.actif ? 'danger' : 'outline'}
            size="sm"
            onClick={() => onToggle(agent)}
          >
            {agent.actif ? 'Désactiver' : 'Activer'}
          </Button>
        </div>
      </td>
    </tr>
  );
}

// ===== MODAL AGENT =====
function ModalAgent({ agent, onConfirm, onCancel, loading }) {
  const isEdit = !!agent;
  const [form, setForm] = useState({
    nom_complet: agent?.nom_complet ?? '',
    pseudo:      agent?.pseudo      ?? '',
    password:    '',
    role:        agent?.role        ?? 'AGENT',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalTitle}>
          {isEdit ? 'Modifier l\'agent' : 'Nouvel agent'}
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>Nom complet *</label>
          <input className={styles.finput} value={form.nom_complet}
            onChange={e => set('nom_complet', e.target.value)} />
        </div>
        <div className={styles.fgrid}>
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Pseudo *</label>
            <input className={styles.finput} value={form.pseudo}
              onChange={e => set('pseudo', e.target.value)} />
          </div>
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Rôle *</label>
            <select className={styles.fselect} value={form.role}
              onChange={e => set('role', e.target.value)}>
              <option value="AGENT">Agent</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
        <div className={styles.fgroup}>
          <label className={styles.flabel}>
            {isEdit ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
          </label>
          <input className={styles.finput} type="password" value={form.password}
            onChange={e => set('password', e.target.value)}
            placeholder={isEdit ? 'Laisser vide pour ne pas modifier' : 'Min. 6 caractères'} />
        </div>
        <div className={styles.modalActions}>
          <Button variant="ghost" size="sm" onClick={onCancel}>Annuler</Button>
          <Button variant="primary" size="sm"
            onClick={() => onConfirm(form)}
            disabled={loading || !form.nom_complet.trim() || !form.pseudo.trim()}>
            {loading ? 'En cours...' : isEdit ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats]         = useState(null);
  const [agents, setAgents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modalAgent, setModal]    = useState(null); // null | 'create' | agent
  const [saveLoading, setSave]    = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toutes, enAttente, enCours, nonPayees, agentsRes] = await Promise.all([
        api.get('/commandes', { params: { per_page: 1 } }),
        api.get('/commandes', { params: { statut: 'EN_ATTENTE',         per_page: 1 } }),
        api.get('/commandes', { params: { statut: 'EN_COURS',           per_page: 1 } }),
        api.get('/commandes', { params: { statut_paiement: 'NON_PAYE',  per_page: 1 } }),
        api.get('/agents'),
      ]);

      setStats({
        total:     toutes.data.meta?.total    ?? 0,
        enAttente: enAttente.data.meta?.total ?? 0,
        enCours:   enCours.data.meta?.total   ?? 0,
        nonPayees: nonPayees.data.meta?.total ?? 0,
      });
      setAgents(agentsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ── Toggle actif ──────────────────────────────────────
  const handleToggle = async (agent) => {
    try {
      await api.patch(`/agents/${agent.id}/toggle`);
      fetchData();
    } catch {
      alert('Erreur lors de la mise à jour.');
    }
  };

  // ── Créer / modifier agent ────────────────────────────
  const handleSaveAgent = async (form) => {
    setSave(true);
    try {
      if (modalAgent === 'create') {
        await api.post('/agents', form);
      } else {
        await api.put(`/agents/${modalAgent.id}`, form);
      }
      setModal(null);
      fetchData();
    } catch (e) {
      const msg = e.response?.data?.message ?? 'Erreur lors de l\'enregistrement.';
      alert(msg);
    } finally {
      setSave(false);
    }
  };

  const agentsActifs = agents.filter(a => a.actif).length;

  return (
    <AppLayout
      title="Vue globale"
      subtitle="Tableau de bord administrateur"
      topbarActions={
        <Button variant="primary" size="sm"
          onClick={() => navigate('/admin/commandes')}>
          Toutes les commandes
        </Button>
      }
    >
      {/* Métriques */}
      <div className={styles.metricsRow}>
        <MetricCard
          label="Total commandes"
          value={loading ? '...' : String(stats?.total ?? 0)}
          tag="Toutes périodes"
          tagType="neutral"
          color="#085041"
        />
        <MetricCard
          label="En attente"
          value={loading ? '...' : String(stats?.enAttente ?? 0)}
          tag="À traiter"
          tagType="warn"
          color="#633806"
        />
        <MetricCard
          label="En cours"
          value={loading ? '...' : String(stats?.enCours ?? 0)}
          tag="En traitement"
          tagType="neutral"
          color="#1a5c2a"
        />
        <MetricCard
          label="Non soldées"
          value={loading ? '...' : String(stats?.nonPayees ?? 0)}
          tag="Paiement en attente"
          tagType="warn"
          color="#791F1F"
        />
      </div>

      {/* Deux colonnes */}
      <div className={styles.twoCol}>

        {/* Commandes récentes */}
        <Card>
          <CardHead
            title="Commandes récentes"
            actions={
              <Button variant="outline" size="sm"
                onClick={() => navigate('/admin/commandes')}>
                Voir tout
              </Button>
            }
          />
          <CardBody noPadding>
            <CommandesRecentes navigate={navigate} />
          </CardBody>
        </Card>

        {/* Colonne droite */}
        <div className={styles.rightCol}>

          {/* Agents */}
          <Card>
            <CardHead
              title="Agents"
              badge={`${agentsActifs} actif${agentsActifs > 1 ? 's' : ''}`}
              actions={
                <Button variant="outline" size="sm"
                  onClick={() => setModal('create')}>
                  + Ajouter
                </Button>
              }
            />
            <CardBody noPadding>
              {loading ? (
                <div className={styles.loadingMsg}>Chargement...</div>
              ) : (
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
                    {agents.map(a => (
                      <AgentRow
                        key={a.id}
                        agent={a}
                        onToggle={handleToggle}
                        onEdit={a => setModal(a)}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>

        </div>
      </div>

      {modalAgent && (
        <ModalAgent
          agent={modalAgent === 'create' ? null : modalAgent}
          onConfirm={handleSaveAgent}
          onCancel={() => setModal(null)}
          loading={saveLoading}
        />
      )}
    </AppLayout>
  );
}

// ── Commandes récentes (sous-composant isolé) ─────────
function CommandesRecentes({ navigate }) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/commandes', { params: { per_page: 6 } })
      .then(({ data }) => setCommandes(data.data))
      .finally(() => setLoading(false));
  }, []);

  const SERVICES_LABELS = {
    IMPRIMERIE: 'Imprimerie', INFORMATIQUE: 'Informatique',
    NEGOCE: 'Négoce',        AMENAGEMENT: 'Aménagement',
  };

  if (loading) return <div className={styles.loadingMsg}>Chargement...</div>;

  return (
    <table className={styles.agentsTable}>
      <thead>
        <tr>
          <th>Référence</th>
          <th>Client</th>
          <th>Agent</th>
          <th>Montant</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        {commandes.map(c => (
          <tr key={c.id} style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/admin/commandes/${c.id}`)}>
            <td><span className={styles.ref}>{c.reference}</span></td>
            <td>{c.client?.nom_complet}</td>
            <td className={styles.agentPseudo}>{c.agent?.nom_complet}</td>
            <td>{Number(c.montant_total).toLocaleString('fr-FR')} F</td>
            <td><Badge type={c.statut} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
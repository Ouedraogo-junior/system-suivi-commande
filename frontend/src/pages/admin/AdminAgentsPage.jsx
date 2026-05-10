import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import api from '../../lib/axios';
import styles from './AdminAgentsPage.module.css';
import { useAuth } from '../../context/AuthContext';

function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
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
            onChange={e => set('nom_complet', e.target.value)}
            placeholder="Ex: Kaboré Jean" />
        </div>
        <div className={styles.fgrid}>
          <div className={styles.fgroup}>
            <label className={styles.flabel}>Pseudo *</label>
            <input className={styles.finput} value={form.pseudo}
              onChange={e => set('pseudo', e.target.value)}
              placeholder="Ex: jean.kabore" />
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
export default function AdminAgentsPage() {
  const { user } = useAuth();  
  const [agents, setAgents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(null); // null | 'create' | agent
  const [saveLoading, setSave]    = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/agents');
      setAgents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgents(); }, []);

  const agentsFiltres = agents
    .filter(a => a.id !== user?.id) // ← exclure l'utilisateur connecté
    .filter(a =>
      a.nom_complet.toLowerCase().includes(search.toLowerCase()) ||
      a.pseudo.toLowerCase().includes(search.toLowerCase())
    );

  const handleToggle = async (agent) => {
    try {
      await api.patch(`/agents/${agent.id}/toggle`);
      fetchAgents();
    } catch {
      alert('Erreur lors de la mise à jour.');
    }
  };

  const handleSave = async (form) => {
    setSave(true);
    try {
      if (modal === 'create') {
        await api.post('/agents', form);
      } else {
        await api.put(`/agents/${modal.id}`, form);
      }
      setModal(null);
      fetchAgents();
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de l\'enregistrement.');
    } finally {
      setSave(false);
    }
  };

  const autresAgents = agents.filter(a => a.id !== user?.id);
  const actifs   = autresAgents.filter(a => a.actif).length;
  const inactifs = autresAgents.filter(a => !a.actif).length;

  return (
    <AppLayout
      title="Agents"
      subtitle={`${actifs} actif${actifs > 1 ? 's' : ''} · ${inactifs} inactif${inactifs > 1 ? 's' : ''}`}
      topbarActions={
        <Button variant="primary" size="sm" onClick={() => setModal('create')}>
          + Nouvel agent
        </Button>
      }
    >
      {/* Barre recherche */}
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Rechercher par nom ou pseudo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tableau */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Pseudo</th>
              <th>Rôle</th>
              <th style={{ textAlign: 'center' }}>Commandes</th>
              <th>Statut</th>
              <th style={{ width: '160px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>Chargement...</td>
              </tr>
            ) : agentsFiltres.length > 0 ? (
              agentsFiltres.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className={styles.agentCell}>
                      <div className={`${styles.avatar} ${!a.actif ? styles.avatarInactif : ''}`}>
                        {getInitiales(a.nom_complet)}
                      </div>
                      <span className={styles.agentNom}>{a.nom_complet}</span>
                    </div>
                  </td>
                  <td className={styles.pseudo}>@{a.pseudo}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${a.role === 'ADMIN' ? styles.roleAdmin : styles.roleAgent}`}>
                      {a.role}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={styles.countBadge}>{a.commandes_count ?? 0}</span>
                  </td>
                  <td>
                    <div className={styles.statutCell}>
                      <span className={`${styles.statutDot} ${a.actif ? styles.dotActif : styles.dotInactif}`} />
                      {a.actif ? 'Actif' : 'Inactif'}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Button variant="ghost" size="sm" onClick={() => setModal(a)}>
                        Modifier
                      </Button>
                      <Button
                        variant={a.actif ? 'danger' : 'outline'}
                        size="sm"
                        onClick={() => handleToggle(a)}
                      >
                        {a.actif ? 'Désactiver' : 'Activer'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>Aucun agent trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ModalAgent
          agent={modal === 'create' ? null : modal}
          onConfirm={handleSave}
          onCancel={() => setModal(null)}
          loading={saveLoading}
        />
      )}
    </AppLayout>
  );
}
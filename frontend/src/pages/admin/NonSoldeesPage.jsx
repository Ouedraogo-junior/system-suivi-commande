import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Badge from '../../components/ui/Badge';
import api from '../../lib/axios';
import styles from './NonSoldeesPage.module.css';

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export default function NonSoldeesPage() {
  const navigate = useNavigate();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filtre, setFiltre]       = useState('tous'); // tous | non_paye | partiel

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = filtre === 'tous'
          ? {} // on charge les deux
          : { statut_paiement: filtre.toUpperCase() };

        if (filtre === 'tous') {
          const [nonPaye, partiel] = await Promise.all([
            api.get('/commandes', { params: { statut_paiement: 'NON_PAYE', per_page: 100 } }),
            api.get('/commandes', { params: { statut_paiement: 'PARTIEL',  per_page: 100 } }),
          ]);
          setCommandes([
            ...nonPaye.data.data,
            ...partiel.data.data,
          ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
        } else {
          const { data } = await api.get('/commandes', {
            params: { ...params, per_page: 100 },
          });
          setCommandes(data.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filtre]);

  const totalRestant = commandes.reduce((s, c) => {
    return s + (Number(c.montant_total) - Number(c.montant_paye));
  }, 0);

  return (
    <AppLayout
      title="Commandes non soldées"
      subtitle={loading ? '' : `${commandes.length} commande${commandes.length > 1 ? 's' : ''} — Reste à percevoir : ${formatMontant(totalRestant)}`}
    >
      {/* Filtres */}
      <div className={styles.toolbar}>
        {[
          { label: 'Toutes',     value: 'tous'     },
          { label: 'Non payées', value: 'non_paye' },
          { label: 'Partielles', value: 'partiel'  },
        ].map(f => (
          <button key={f.value}
            className={`${styles.filterBtn} ${filtre === f.value ? styles.filterBtnOn : ''}`}
            onClick={() => setFiltre(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Client</th>
              <th>Agent</th>
              <th>Échéance</th>
              <th>Total</th>
              <th>Payé</th>
              <th>Reste</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className={styles.emptyRow}>Chargement...</td></tr>
            ) : commandes.length > 0 ? (
              commandes.map(c => {
                const reste = Number(c.montant_total) - Number(c.montant_paye);
                const enRetard = c.date_echeance && new Date(c.date_echeance) < new Date() && c.statut !== 'ANNULE';
                return (
                  <tr key={c.id}
                    className={enRetard ? styles.rowRetard : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/admin/commandes/${c.id}`)}>
                    <td><span className={styles.ref}>{c.reference}</span></td>
                    <td>
                      <div className={styles.clientCell}>
                        <div className={styles.clientAv}>{getInitiales(c.client?.nom_complet)}</div>
                        <span>{c.client?.nom_complet}</span>
                      </div>
                    </td>
                    <td className={styles.muted}>{c.agent?.nom_complet}</td>
                    <td className={enRetard ? styles.dateRetard : styles.muted}>
                      {formatDate(c.date_echeance)}
                      {enRetard && <span className={styles.retardTag}>En retard</span>}
                    </td>
                    <td className={styles.montant}>{formatMontant(c.montant_total)}</td>
                    <td className={styles.montantPaye}>{formatMontant(c.montant_paye)}</td>
                    <td className={styles.montantReste}>{formatMontant(reste)}</td>
                    <td><Badge type={c.statut_paiement} /></td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={8} className={styles.emptyRow}>Aucune commande non soldée. 🎉</td></tr>
            )}
          </tbody>
          {!loading && commandes.length > 0 && (
            <tfoot>
              <tr className={styles.tfootTotal}>
                <td colSpan={6}>Total reste à percevoir</td>
                <td>{formatMontant(totalRestant)}</td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </AppLayout>
  );
}
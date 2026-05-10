import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../lib/axios';
import styles from './StatistiquesPage.module.css';

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

const ANNEES = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

// ===== GRAPHIQUE BARRES =====
function BarChart({ data, keyEntree, keySortie }) {
  const max = Math.max(...data.map(d => Math.max(d[keyEntree] || 0, d[keySortie] || 0)), 1);

  return (
    <div className={styles.barChart}>
      {data.map((d, i) => (
        <div key={i} className={styles.barGroup}>
          <div className={styles.barPair}>
            <div
              className={`${styles.bar} ${styles.barEntree}`}
              style={{ height: `${Math.round((d[keyEntree] / max) * 100)}px` }}
              title={formatMontant(d[keyEntree])}
            />
            <div
              className={`${styles.bar} ${styles.barSortie}`}
              style={{ height: `${Math.round((d[keySortie] / max) * 100)}px` }}
              title={formatMontant(d[keySortie])}
            />
          </div>
          <span className={styles.barLabel}>{d.mois}</span>
        </div>
      ))}
      <div className={styles.barLegend}>
        <span className={styles.legendEntree}>■ Entrées</span>
        <span className={styles.legendSortie}>■ Sorties</span>
      </div>
    </div>
  );
}

// ===== PAGE =====
export default function StatistiquesPage() {
  const [annee, setAnnee]       = useState(new Date().getFullYear());
  const [stats, setStats]       = useState(null);
  const [commandes, setCmd]     = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Stats financières 12 mois
        const evolution12 = await Promise.all(
          Array.from({ length: 12 }, (_, i) =>
            api.get('/transactions/stats', { params: { mois: i + 1, annee } })
          )
        );

        const parMois = evolution12.map((r, i) => ({
          mois:    r.data.evolution?.at(-1)?.mois ?? `M${i + 1}`,
          entrees: r.data.entrees,
          sorties: r.data.sorties,
          solde:   r.data.solde,
        }));

        const totalEntrees = parMois.reduce((s, m) => s + m.entrees, 0);
        const totalSorties = parMois.reduce((s, m) => s + m.sorties, 0);

        // Stats commandes
        const [total, termine, annule, nonPaye, partiel] = await Promise.all([
          api.get('/commandes', { params: { per_page: 1 } }),
          api.get('/commandes', { params: { statut: 'TERMINE',          per_page: 1 } }),
          api.get('/commandes', { params: { statut: 'ANNULE',           per_page: 1 } }),
          api.get('/commandes', { params: { statut_paiement: 'NON_PAYE', per_page: 1 } }),
          api.get('/commandes', { params: { statut_paiement: 'PARTIEL',  per_page: 1 } }),
        ]);

        setStats({ parMois, totalEntrees, totalSorties, totalSolde: totalEntrees - totalSorties });
        setCmd({
          total:    total.data.meta?.total    ?? 0,
          termine:  termine.data.meta?.total  ?? 0,
          annule:   annule.data.meta?.total   ?? 0,
          nonPaye:  nonPaye.data.meta?.total  ?? 0,
          partiel:  partiel.data.meta?.total  ?? 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [annee]);

  return (
    <AppLayout
      title="Statistiques"
      subtitle="Vue annuelle"
      topbarActions={
        <select className={styles.anneeSelect} value={annee}
          onChange={e => setAnnee(Number(e.target.value))}>
          {ANNEES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      }
    >
      {loading ? (
        <div className={styles.loadingMsg}>Chargement...</div>
      ) : (
        <>
          {/* Résumé financier */}
          <div className={styles.resumeRow}>
            <div className={`${styles.resumeCard} ${styles.cardEntree}`}>
              <div className={styles.resumeLabel}>Total entrées {annee}</div>
              <div className={styles.resumeValue}>{formatMontant(stats.totalEntrees)}</div>
            </div>
            <div className={`${styles.resumeCard} ${styles.cardSortie}`}>
              <div className={styles.resumeLabel}>Total sorties {annee}</div>
              <div className={styles.resumeValue}>{formatMontant(stats.totalSorties)}</div>
            </div>
            <div className={`${styles.resumeCard} ${stats.totalSolde >= 0 ? styles.cardSoldePos : styles.cardSoldeNeg}`}>
              <div className={styles.resumeLabel}>Solde net {annee}</div>
              <div className={styles.resumeValue}>
                {stats.totalSolde >= 0 ? '+' : ''}{formatMontant(stats.totalSolde)}
              </div>
            </div>
          </div>

          <div className={styles.grid}>
            {/* Graphique évolution */}
            <div className={styles.card}>
              <div className={styles.cardHead}>Évolution mensuelle {annee}</div>
              <div className={styles.cardBody}>
                <BarChart
                  data={stats.parMois}
                  keyEntree="entrees"
                  keySortie="sorties"
                />
              </div>
            </div>

            {/* Commandes */}
            <div className={styles.card}>
              <div className={styles.cardHead}>Commandes — aperçu global</div>
              <div className={styles.cardBody}>
                <div className={styles.cmdGrid}>
                  <div className={styles.cmdStat}>
                    <div className={styles.cmdValue}>{commandes.total}</div>
                    <div className={styles.cmdLabel}>Total</div>
                  </div>
                  <div className={styles.cmdStat}>
                    <div className={`${styles.cmdValue} ${styles.vGreen}`}>{commandes.termine}</div>
                    <div className={styles.cmdLabel}>Terminées</div>
                  </div>
                  <div className={styles.cmdStat}>
                    <div className={`${styles.cmdValue} ${styles.vRed}`}>{commandes.annule}</div>
                    <div className={styles.cmdLabel}>Annulées</div>
                  </div>
                  <div className={styles.cmdStat}>
                    <div className={`${styles.cmdValue} ${styles.vAmber}`}>{commandes.nonPaye}</div>
                    <div className={styles.cmdLabel}>Non soldées</div>
                  </div>
                  <div className={styles.cmdStat}>
                    <div className={`${styles.cmdValue} ${styles.vBlue}`}>{commandes.partiel}</div>
                    <div className={styles.cmdLabel}>Partielles</div>
                  </div>
                </div>

                {/* Taux de complétion */}
                {commandes.total > 0 && (
                  <div className={styles.tauxWrap}>
                    <div className={styles.tauxLabel}>
                      Taux de complétion
                      <span>{Math.round((commandes.termine / commandes.total) * 100)}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${(commandes.termine / commandes.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Tableau mensuel */}
                <div className={styles.mensuelWrap}>
                  <table className={styles.mensuelTable}>
                    <thead>
                      <tr>
                        <th>Mois</th>
                        <th>Entrées</th>
                        <th>Sorties</th>
                        <th>Solde</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.parMois.map((m, i) => (
                        <tr key={i}>
                          <td className={styles.moisCell}>{m.mois}</td>
                          <td className={styles.vGreen}>{formatMontant(m.entrees)}</td>
                          <td className={styles.vRed}>{formatMontant(m.sorties)}</td>
                          <td className={m.solde >= 0 ? styles.vGreen : styles.vRed}>
                            {m.solde >= 0 ? '+' : ''}{formatMontant(m.solde)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
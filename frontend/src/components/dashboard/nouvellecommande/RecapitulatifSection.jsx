// src/components/dashboard/nouvellecommande/RecapitulatifSection.jsx
import Button from '../../ui/Button';
import styles from '../../../pages/dashboard/NouvelleCommandePage.module.css';

function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

export default function RecapitulatifSection({
  sousTotal,
  remise,
  remiseType,
  montantRemise,
  tva,
  tvaTaux,
  montantTVA,
  total,
  loading,
  commandeCree,
  onSubmit,
  onGenererProForma,
  onVoirCommande,
}) {
  // const remisePct    = parseFloat(remise) || 0;
  // const montantRemise = sousTotal * remisePct / 100;

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>Récapitulatif</div>
      <div className={styles.cardBody}>

        <div className={styles.recapRow}>
          <span>Sous-total</span>
          <span>{formatMontant(sousTotal)}</span>
        </div>

        {montantRemise > 0 && (
          <div className={styles.recapRow}>
            <span>Remise{remiseType === 'PERCENT' ? ` (${parseFloat(remise) || 0}%)` : ''}</span>
            <span>− {formatMontant(montantRemise)}</span>
          </div>
        )}

        {tva && (
          <div className={styles.recapRow}>
            <span>TVA ({tvaTaux}%)</span>
            <span>+ {formatMontant(montantTVA)}</span>
          </div>
        )}

        <div className={styles.recapTotal}>
          <span>Total</span>
          <span>{formatMontant(total)}</span>
        </div>

        {commandeCree ? (
          <div className={styles.creeeActions}>
            <div className={styles.creeeMsg}>✓ Commande créée</div>
            <Button variant="primary" size="md" fullWidth onClick={onGenererProForma}>
              📄 Générer le pro forma
            </Button>
            <Button variant="outline" size="md" fullWidth onClick={onVoirCommande}>
              Voir la commande →
            </Button>
          </div>
        ) : (
          <Button
            variant="primary" size="md" fullWidth
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Créer la commande'}
          </Button>
        )}

      </div>
    </div>
  );
}
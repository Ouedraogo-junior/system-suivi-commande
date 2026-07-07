// src/components/dashboard/commandedetail/InformationsSection.jsx
import Button from '../../../components/ui/Button';
import styles from '../../../pages/dashboard/CommandeDetailPage.module.css';
import { SERVICES_LABELS, formatDate, formatRemise } from './useCommandeDetail';

// ===== SECTION CARD (générique, réutilisée par les autres blocs) =====
export function Section({ title, children, action }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionTitle}>{title}</div>
        {action}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

// ===== CHAMP INFO =====
export function InfoField({ label, value }) {
  return (
    <div className={styles.infoField}>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value ?? '—'}</div>
    </div>
  );
}

// ===== BLOC INFORMATIONS =====
export default function InformationsSection({ commande, peutModifier, onModifier }) {
  return (
    <Section
      title="Informations"
      action={
        peutModifier && (
          <Button variant="outline" size="sm" onClick={onModifier}>
            ✏️ Modifier
          </Button>
        )
      }
    >
      <div className={styles.infoGrid}>
        <InfoField label="Référence"  value={commande.reference} />
        <InfoField label="Service"    value={SERVICES_LABELS[commande.service]} />
        <InfoField label="Agent"      value={commande.agent?.nom_complet} />
        <InfoField label="Échéance"   value={formatDate(commande.date_echeance)} />
        <InfoField label="Remise"     value={formatRemise(commande)} />
        <InfoField label="TVA" value={commande.tva_applicable ? `Applicable (${commande.tva_taux ?? 18}%)` : 'Non applicable'} />
        <InfoField label="Créée le"   value={formatDate(commande.created_at)} />
      </div>
      {commande.notes && (
        <div className={styles.notes}>
          <div className={styles.infoLabel}>Notes</div>
          <div className={styles.notesText}>{commande.notes}</div>
        </div>
      )}
    </Section>
  );
}
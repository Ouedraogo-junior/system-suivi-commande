import styles from './Badge.module.css';

const variants = {
  // Statuts commande
  EN_ATTENTE: { label: 'En attente',  cls: 'warning' },
  EN_COURS:   { label: 'En cours',    cls: 'info'    },
  TERMINE:    { label: 'Terminé',     cls: 'success' },
  ANNULE:     { label: 'Annulé',      cls: 'danger'  },
  // Statuts paiement
  NON_PAYE:   { label: 'Non payé',    cls: 'danger'  },
  PARTIEL:    { label: 'Partiel',     cls: 'warning' },
  PAYE:       { label: 'Payé',        cls: 'success' },
  // Rôles
  ADMIN:      { label: 'Admin',       cls: 'info'    },
  AGENT:      { label: 'Agent',       cls: 'neutral' },
};

export default function Badge({ type, label: customLabel }) {
  const variant = variants[type] || { label: type, cls: 'neutral' };
  const label   = customLabel || variant.label;

  return (
    <span className={`${styles.badge} ${styles[variant.cls]}`}>
      {label}
    </span>
  );
}
// src/pages/public/components/contact/LocalisationContact.jsx
import styles from './ContactComponents.module.css';

export default function LocalisationContact({ t }) {
  const loc = t.localisation;

  return (
    <section className={styles.localisation}>
      <div className={styles.locInner}>
        <div className={styles.locHeader}>
          <div className={styles.sectionLabel}>{loc.label}</div>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--green-dark)' }}>{loc.title}</h2>
          <p className={styles.locAddress}>{loc.address}</p>
          <a
            href={loc.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.locMapsBtn}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {loc.mapsBtn}
          </a>
        </div>

        {/* Carte iframe Google Maps */}
        <div className={styles.locMap}>
          <iframe
            title="SOGECOP localisation"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.0!2d-1.5126!3d12.3564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDIxJzIzLjAiTiAxwrAzMCc0NS42Ilc!5e0!3m2!1sfr!2sbf!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '10px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
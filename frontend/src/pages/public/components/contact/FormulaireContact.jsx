// src/pages/public/components/contact/FormulaireContact.jsx
import { useState } from 'react';
import styles from './ContactComponents.module.css';

const WHATSAPP_NUMBER = '22655088636';

const Icons = {
  email: (
    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  ),
  phone: (
    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z"/>
    </svg>
  ),
  address: (
    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  hours: (
    <svg width="14" height="14" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  whatsapp: (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  ),
};

export default function FormulaireContact({ t }) {
  const f = t.form;
  const infos = t.infos;

  const [form, setForm] = useState({ nom: '', email: '', service: f.service.options[0], message: '' });
  const [error, setError] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(false);
  }

  function handleSubmit() {
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      setError(true);
      return;
    }
    const text =
      `Bonjour SOGECOP 👋\n\n` +
      `*Nom :* ${form.nom}\n` +
      `*Email :* ${form.email}\n` +
      `*Service :* ${form.service}\n\n` +
      `*Message :*\n${form.message}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  return (
    <section className={styles.formulaire}>
      {/* Colonne gauche — infos */}
      <div className={styles.formLeft}>
        <div className={styles.sectionLabel}>{infos.label}</div>
        <h2 className={styles.sectionTitle}>{infos.title}</h2>
        <div className={styles.contactItems}>
          {infos.items.map((item) => (
            <div key={item.key} className={styles.contactItem}>
              <div className={styles.contactIconWrap}>{Icons[item.key]}</div>
              <div>
                <div className={styles.contactTextLabel}>{item.label}</div>
                <div className={styles.contactTextVal}>
                  {item.val.split('\n').map((line, i) => (
                    <span key={i}>{line}{i < item.val.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colonne droite — formulaire */}
      <div className={styles.formRight}>
        <div className={styles.formTitle}>{f.title}</div>

        <label className={styles.formLabel}>{f.nom.label}</label>
        <input
          className={styles.formInput}
          type="text"
          name="nom"
          placeholder={f.nom.placeholder}
          value={form.nom}
          onChange={handleChange}
        />

        <label className={styles.formLabel}>{f.email.label}</label>
        <input
          className={styles.formInput}
          type="email"
          name="email"
          placeholder={f.email.placeholder}
          value={form.email}
          onChange={handleChange}
        />

        <label className={styles.formLabel}>{f.service.label}</label>
        <select
          className={styles.formSelect}
          name="service"
          value={form.service}
          onChange={handleChange}
        >
          {f.service.options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>

        <label className={styles.formLabel}>{f.message.label}</label>
        <textarea
          className={styles.formTextarea}
          name="message"
          placeholder={f.message.placeholder}
          value={form.message}
          onChange={handleChange}
          rows={4}
        />

        {error && <div className={styles.formError}>{f.required}</div>}

        <button className={styles.formSubmit} onClick={handleSubmit}>
          <span className={styles.formSubmitIcon}>{Icons.whatsapp}</span>
          {f.submit}
        </button>
      </div>
    </section>
  );
}
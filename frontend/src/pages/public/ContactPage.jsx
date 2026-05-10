// src/pages/public/ContactPage.jsx
import { useOutletContext } from 'react-router-dom';
import { CONTACT_CONTENT }   from './data/contact.data';
import HeroContact           from './components/contact/HeroContact';
import FormulaireContact     from './components/contact/FormulaireContact';
import LocalisationContact   from './components/contact/LocalisationContact';
import styles                from './ContactPage.module.css';

export default function ContactPage() {
  const { lang } = useOutletContext();
  const t = CONTACT_CONTENT[lang];

  return (
    <div className={styles.page}>
      <HeroContact        t={t} />
      <FormulaireContact  t={t} />
      <LocalisationContact t={t} />
    </div>
  );
}
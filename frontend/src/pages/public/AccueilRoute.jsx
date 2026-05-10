// src/pages/public/AccueilRoute.jsx
// Wrapper qui récupère `lang` depuis PublicLayout via useOutletContext
import { useOutletContext } from 'react-router-dom';
import AccueilPage from './AccueilPage';

export default function AccueilRoute() {
  const { lang } = useOutletContext();
  return <AccueilPage lang={lang} />;
}
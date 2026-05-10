// src/pages/public/PublicLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavPublic from './components/NavPublic';
import FooterPublic from './components/FooterPublic';

export default function PublicLayout() {
  const [lang, setLang] = useState('fr');

  return (
    <div>
      <NavPublic lang={lang} setLang={setLang} />
      {/* On passe lang via context ou props — ici via Outlet context */}
      <Outlet context={{ lang }} />
      <FooterPublic lang={lang} />
    </div>
  );
}
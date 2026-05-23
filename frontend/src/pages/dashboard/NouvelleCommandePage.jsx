// src/pages/dashboard/NouvelleCommandePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import Button from '../../components/ui/Button';
import ModalDocument from '../../components/ui/ModalDocument';
import ClientSection from '../../components/dashboard/nouvellecommande/ClientSection';
import LignesSection, { calcSousTotal } from '../../components/dashboard/nouvellecommande/LignesSection';
import ParametresSection from '../../components/dashboard/nouvellecommande/ParametresSection';
import RecapitulatifSection from '../../components/dashboard/nouvellecommande/RecapitulatifSection';
import api from '../../lib/axios';
import styles from './NouvelleCommandePage.module.css';

const nouvelleLigne = () => ({
  _key:          Math.random(),
  designation:   '',
  quantite:      '',
  prix_unitaire: '',
});

export default function NouvelleCommandePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin') ? '/admin' : '/dashboard';

  // ── State client ─────────────────────────────────────────────────────────
  const [clientSelectionne, setClient] = useState(null);

  // ── State commande ────────────────────────────────────────────────────────
  const [service,       setService]       = useState('IMPRIMERIE');
  const [remise,        setRemise]        = useState('');
  const [tva,           setTva]           = useState(false);
  const [tvaTaux,       setTvaTaux]       = useState(18);
  const [dateEcheance,  setDateEcheance]  = useState('');
  const [notes,         setNotes]         = useState('');
  const [lignes,        setLignes]        = useState([nouvelleLigne()]);

  // ── State soumission ──────────────────────────────────────────────────────
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  // ── State post-création ───────────────────────────────────────────────────
  const [commandeCree, setCommandeCree] = useState(null);
  const [modalDoc,     setModalDoc]     = useState(null); // 'PRO_FORMA' | null

  // ── Pré-remplissage client depuis navigation ──────────────────────────────
  useEffect(() => {
    if (location.state?.client) {
      setClient(location.state.client);
    }
  }, []);

  // ── Lignes ────────────────────────────────────────────────────────────────
  const updateLigne = (key, field, val) =>
    setLignes(ls => ls.map(l => l._key === key ? { ...l, [field]: val } : l));

  const ajouterLigne   = () => setLignes(ls => [...ls, nouvelleLigne()]);
  const supprimerLigne = (key) => {
    if (lignes.length === 1) return;
    setLignes(ls => ls.filter(l => l._key !== key));
  };

  // ── Calculs ───────────────────────────────────────────────────────────────
  const sousTotal    = lignes.reduce((s, l) => s + calcSousTotal(l), 0);
  const apresRemise  = sousTotal * (1 - (parseFloat(remise) || 0) / 100);
  const montantTVA   = tva ? apresRemise * (tvaTaux / 100) : 0;
  const total        = apresRemise + montantTVA;

  // ── Validation ────────────────────────────────────────────────────────────
  const valider = () => {
    const e = {};
    if (!clientSelectionne) e.client = 'Sélectionnez un client.';
    lignes.forEach((l, i) => {
      if (!l.designation.trim())                e[`lig_${i}_des`] = 'Désignation requise.';
      if (!l.quantite || l.quantite <= 0)       e[`lig_${i}_qte`] = 'Quantité invalide.';
      if (l.prix_unitaire === '' || l.prix_unitaire < 0) e[`lig_${i}_pu`]  = 'Prix invalide.';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Soumission ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!valider()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/commandes', {
        client_id:      clientSelectionne.id,
        service,
        remise:         parseFloat(remise) || 0,
        tva_applicable: tva,
        tva_taux:       tva ? tvaTaux : 0,
        date_echeance:  dateEcheance || null,
        notes:          notes || null,
        lignes: lignes.map((l, i) => ({
          designation:   l.designation,
          quantite:      parseFloat(l.quantite),
          prix_unitaire: parseFloat(l.prix_unitaire),
          ordre:         i + 1,
        })),
      });

      console.log('réponse API complète:', data);
      console.log('tva_applicable:', data.tva_applicable);
      console.log('tva_taux:', data.tva_taux);
      
      setCommandeCree(data);
    } catch (e) {
      const msg = e.response?.data?.message ?? 'Erreur lors de la création.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <AppLayout
      title="Nouvelle commande"
      subtitle="Espace agent"
      topbarActions={
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          ← Retour
        </Button>
      }
    >
      <div className={styles.layout}>

        {/* Colonne principale */}
        <div className={styles.colMain}>
          <ClientSection
            clientSelectionne={clientSelectionne}
            onSelect={setClient}
            onDeselect={() => setClient(null)}
            error={errors.client}
          />
          <LignesSection
            lignes={lignes}
            onChange={updateLigne}
            onAjouter={ajouterLigne}
            onSupprimer={supprimerLigne}
            errors={errors}
          />
        </div>

        {/* Colonne latérale */}
        <div className={styles.colSide}>
          <ParametresSection
            service={service}               onServiceChange={setService}
            remise={remise}                 onRemiseChange={setRemise}
            tva={tva}                       onTvaChange={setTva}
            tvaTaux={tvaTaux}               onTvaTauxChange={setTvaTaux}
            dateEcheance={dateEcheance}     onDateEcheanceChange={setDateEcheance}
            notes={notes}                   onNotesChange={setNotes}
          />
          <RecapitulatifSection
            sousTotal={sousTotal}
            remise={remise}
            tva={tva}
            tvaTaux={tvaTaux}
            montantTVA={montantTVA}
            total={total}
            loading={loading}
            commandeCree={commandeCree}
            onSubmit={handleSubmit}
            onGenererProForma={() => setModalDoc('PRO_FORMA')}
            onVoirCommande={() => navigate(`${basePath}/commandes/${commandeCree.id}`)}
          />
        </div>

      </div>

      {modalDoc && commandeCree && (
        <ModalDocument
          commande={{ ...commandeCree, versements: [] }}
          type={modalDoc}
          onClose={() => {
            setModalDoc(null);
            navigate(`${basePath}/commandes/${commandeCree.id}`);
          }}
        />
      )}
    </AppLayout>
  );
}
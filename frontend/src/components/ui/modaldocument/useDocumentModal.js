// src/components/ui/modaldocument/useDocumentModal.js
import { useState } from 'react';
import api from '../../../lib/axios';

export const REMISE_OPTIONS   = [0, 20, 30, 50];
export const ACOMPTE_OPTIONS  = [0, 50, 70, 100];
export const DELAI_OPTIONS    = ['1 jour', '3 jours', '5 jours', '7 jours', '10 jours', '15 jours', '20 jours'];
export const VALIDITE_OPTIONS = ['15 jours', '30 jours', '45 jours', '60 jours'];
export const CONDITIONS_IMPRIMERIE = `Condition 1 : Délai de production et de réception 01–20 jours à compter de la validation de la maquette.\nCondition 2 : Paiement préalable d'un acompte de 70% si le montant TTC excède 200 000 F CFA et 30% à la réception. Cas échéant, 50% à la commande et 50% à la réception.`;

function calcBrut(commande) {
  return commande.lignes?.reduce((s, l) => s + Number(l.sous_total), 0) || 0;
}

export function calculs(commande, remiseTaux, acompteTaux, acompteMontantLibre, tvaTaux = 0) {
  const brut       = calcBrut(commande);
  const remise     = brut * (remiseTaux / 100);
  const netHT      = brut - remise;
  const tva        = netHT * (tvaTaux / 100);
  const ttc        = netHT + tva;
  const acompte    = acompteMontantLibre > 0
    ? acompteMontantLibre
    : ttc * (acompteTaux / 100);
  const reste      = ttc - acompte;
  const totalVerse = commande.versements?.reduce((s, v) => s + Number(v.montant), 0) || 0;
  const solde      = ttc - totalVerse;
  return { brut, remise, netHT, tva, ttc, acompte, reste, totalVerse, solde };
}

export function fmt(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F CFA';
}

export default function useDocumentModal(commande, type, onClose) {
  const isProforma    = type === 'PRO_FORMA';
  const isFacture     = type === 'FACTURE';
  const isBonLiv      = type === 'BON_LIVRAISON';
  const isImprimerie  = commande.service === 'IMPRIMERIE';
  const tvaTaux       = commande.tva_applicable ? (Number(commande.tva_taux) || 18) : 0;

  // Remise (pro forma + facture)
  const [remiseTaux,    setRemiseTaux]    = useState(Number(commande.remise) || 0);
  const [remiseLibre,   setRemiseLibre]   = useState('');
  const [remiseType, setRemiseTypeRaw] = useState('PERCENT'); // 'PERCENT' | 'MONTANT'

  const setRemiseType = (t) => {
    setRemiseTypeRaw(t);
    setRemiseTaux(0);
    setRemiseLibre('');
  };

  // Délai livraison (pro forma)
  const [delai,         setDelai]         = useState('');
  const [delaiLibre,    setDelaiLibre]    = useState('');

  // Acompte (pro forma)
  const [acompteTaux,   setAcompteTaux]   = useState(0);
  const [acompteLibre,  setAcompteLibre]  = useState('');

  // Conditions + validité (pro forma non-imprimerie)
  const [conditions,    setConditions]    = useState(isImprimerie ? CONDITIONS_IMPRIMERIE : '');
  const [validite,      setValidite]      = useState('30 jours');
  const [validiteLibre, setValiditeLibre] = useState('');

  // Objet (bon de livraison)
  const [objet,         setObjet]         = useState('');

  // UI
  const [onglet,     setOnglet]     = useState('params');
  const [generating, setGenerating] = useState(false);

  // Valeurs finales
  const brut = calcBrut(commande);

  const remiseFinal = remiseType === 'MONTANT'
    ? (brut > 0 ? (Math.min(parseFloat(remiseLibre) || 0, brut) / brut) * 100 : 0)
    : (remiseLibre !== '' ? parseFloat(remiseLibre) || 0 : remiseTaux);

  const acompteFinal  = acompteLibre !== '' ? parseFloat(acompteLibre) || 0 : 0;
  const delaiFinal    = delaiLibre   || delai   || null;
  const validiteFinal = validiteLibre || validite || '30 jours';

  const genererBlob = async () => {
  let endpoint, payload;

  if (isProforma) {
    endpoint = `/commandes/${commande.id}/documents/proforma`;
    payload  = {
      remise_taux:      remiseFinal,
      delai_livraison:  delaiFinal,
      acompte_taux:     acompteLibre !== '' ? 0 : acompteTaux,
      acompte_montant:  acompteLibre !== '' ? parseFloat(acompteLibre) || 0 : 0,
      tva_taux:         tvaTaux,
      conditions:       conditions || null,
      validite:         validiteFinal,
    };
  } else if (isFacture) {
    endpoint = `/commandes/${commande.id}/documents/facture`;
    payload  = { remise_taux: remiseFinal, tva_taux: tvaTaux };
  } else {
    endpoint = `/commandes/${commande.id}/documents/bon-livraison`;
    payload  = { objet: objet || null };
  }

  const response = await api.post(endpoint, payload, { responseType: 'blob' });
  return new Blob([response.data], { type: 'application/pdf' });
};

const handleTelecharger = async () => {
  setGenerating(true);
  try {
    const blob = await genererBlob();
    const url  = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${type.toLowerCase()}-${commande.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
    onClose();
  } catch {
    alert('Erreur lors de la génération du document.');
  } finally {
    setGenerating(false);
  }
};

const handleImprimer = async () => {
  setGenerating(true);
  try {
    const blob = await genererBlob();
    const url  = window.URL.createObjectURL(blob);

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };

    // Nettoyage après impression (l'iframe reste le temps que l'utilisateur imprime/annule)
    setTimeout(() => {
      document.body.removeChild(iframe);
      window.URL.revokeObjectURL(url);
    }, 60000); // 1 minute, ajustable

    onClose();
  } catch {
    alert('Erreur lors de la génération du document.');
  } finally {
    setGenerating(false);
  }
};

  return {
    isProforma, isFacture, isBonLiv, isImprimerie, tvaTaux,
    remiseTaux,    setRemiseTaux,    remiseLibre,   setRemiseLibre,
    remiseType,    setRemiseType,
    delai,         setDelai,         delaiLibre,    setDelaiLibre,
    acompteTaux,   setAcompteTaux,   acompteLibre,  setAcompteLibre,
    conditions,    setConditions,
    validite,      setValidite,      validiteLibre, setValiditeLibre,
    objet,         setObjet,
    onglet,        setOnglet,
    generating,
    remiseFinal, acompteFinal, delaiFinal, validiteFinal,
    handleTelecharger,
    handleImprimer,
  };
}
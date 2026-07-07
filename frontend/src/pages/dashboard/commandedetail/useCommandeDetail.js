// src/components/dashboard/commandedetail/useCommandeDetail.js
import { useState, useEffect } from 'react';
import api from '../../../lib/axios';

// ===== CONSTANTES =====
export const SERVICES_LABELS = {
  IMPRIMERIE:   'Imprimerie',
  INFORMATIQUE: 'Informatique',
  NEGOCE:       'Négoce',
  AMENAGEMENT:  'Aménagement',
};

export const STATUTS_SUIVANTS = {
  EN_ATTENTE: ['EN_COURS', 'ANNULE'],
  EN_COURS:   ['TERMINE', 'ANNULE'],
  TERMINE:    [],
  ANNULE:     [],
};

export const STATUTS_LABELS = {
  EN_ATTENTE: 'En attente',
  EN_COURS:   'En cours',
  TERMINE:    'Terminée',
  ANNULE:     'Annulée',
};

// ===== HELPERS DE FORMAT =====
export function formatMontant(v) {
  return Number(v || 0).toLocaleString('fr-FR') + ' F';
}

export function formatRemise(commande) {
   if (!commande.remise || commande.remise <= 0) return 'Aucune';
   return commande.remise_type === 'MONTANT'
   ? formatMontant(commande.remise)
   : `${commande.remise}%`;
}

export function calculerMontantRemise(sousTotal, commande) {
   if (!commande.remise || commande.remise <= 0) return 0;
   return commande.remise_type === 'MONTANT'
     ? Math.min(commande.remise, sousTotal)
     : sousTotal * (commande.remise / 100);
 }

export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function getInitiales(nom = '') {
  return nom.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ===== HOOK =====
export default function useCommandeDetail(id) {
  const [commande, setCommande]        = useState(null);
  const [loading, setLoading]          = useState(true);
  const [error, setError]              = useState(null);
  const [actionLoading, setActionLoad] = useState(false);

  const fetchCommande = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/commandes/${id}`);
      setCommande(data);
    } catch {
      setError('Commande introuvable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCommande(); }, [id]);

  // Chaque handler renvoie true (succès) / false (échec) : la page décide
  // de fermer la modal correspondante en fonction du résultat.

  const handleChangerStatut = async (payload) => {
    setActionLoad(true);
    try {
      await api.patch(`/commandes/${id}/statut`, payload);
      await fetchCommande();
      return true;
    } catch {
      alert('Erreur lors du changement de statut.');
      return false;
    } finally {
      setActionLoad(false);
    }
  };

  const handleVersement = async (payload) => {
    setActionLoad(true);
    try {
      await api.post(`/commandes/${id}/versements`, payload);
      await fetchCommande();
      return true;
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de l\'enregistrement.');
      return false;
    } finally {
      setActionLoad(false);
    }
  };

  const handleEditVersement = async (versementId, payload) => {
    setActionLoad(true);
    try {
      await api.put(`/commandes/${id}/versements/${versementId}`, payload);
      await fetchCommande();
      return true;
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de la modification.');
      return false;
    } finally {
      setActionLoad(false);
    }
  };

  const handleSupprimerVersement = async (versementId) => {
    if (!confirm('Supprimer ce versement ?')) return;
    setActionLoad(true);
    try {
      await api.delete(`/commandes/${id}/versements/${versementId}`);
      await fetchCommande();
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de la suppression.');
    } finally {
      setActionLoad(false);
    }
  };

  const handleEditionLignes = async (payload) => {
    setActionLoad(true);
    try {
      await api.put(`/commandes/${id}`, payload);
      await fetchCommande();
      return true;
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de la modification.');
      return false;
    } finally {
      setActionLoad(false);
    }
  };

  const handleEditionInfos = async (payload) => {
    setActionLoad(true);
    try {
      await api.put(`/commandes/${id}`, payload);
      await fetchCommande();
      return true;
    } catch (e) {
      alert(e.response?.data?.message ?? 'Erreur lors de la modification.');
      return false;
    } finally {
      setActionLoad(false);
    }
  };

  return {
    commande, loading, error, actionLoading,
    handleChangerStatut,
    handleVersement,
    handleEditVersement,
    handleSupprimerVersement,
    handleEditionLignes,
    handleEditionInfos,
  };
}
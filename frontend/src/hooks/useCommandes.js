import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

export function useCommandes(filtres = {}) {
  const [commandes, setCommandes] = useState([]);
  const [meta, setMeta]           = useState(null); // pagination
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchCommandes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/commandes', { params: { ...filtres, ...params } });
      setCommandes(data.data);
      setMeta(data.meta);
    } catch (e) {
      setError('Erreur lors du chargement des commandes.');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filtres)]);

  useEffect(() => { fetchCommandes(); }, [fetchCommandes]);

  return { commandes, meta, loading, error, refetch: fetchCommandes };
}
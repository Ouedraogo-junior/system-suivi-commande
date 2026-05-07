import { useState, useEffect } from 'react';
import api from '../lib/axios';

export function useClients(search = '') {
  const [clients, setClients]   = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/clients', { params: { search, per_page: 50 } });
        if (!cancelled) setClients(data.data ?? data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300); // debounce

    return () => { cancelled = true; clearTimeout(timer); };
  }, [search]);

  return { clients, loading };
}
import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const useEventsStore = create((set, get) => ({
  events: [],
  stats: null,
  loading: false,
  error: null,

  fetchEvents: async (token, filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_URL}/events?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ events: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao carregar eventos', loading: false });
    }
  },

  fetchStats: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/stats/by-route`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ stats: response.data });
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao carregar estatísticas' });
    }
  },
}));

export default useEventsStore;

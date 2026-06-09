import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  requestOTP: async (email) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/request-otp`, { email });
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao solicitar código', loading: false });
      throw error;
    }
  },

  verifyOTP: async (email, code) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/verify`, { email, code });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, token, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.error || 'Erro ao verificar código', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;

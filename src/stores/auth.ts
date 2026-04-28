import { defineStore } from 'pinia';

import type { User } from '@/modules/users/types';
import api from '@/services/api';

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') ?? sessionStorage.getItem('token'),
    user: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(email: string, password: string, remember_me: boolean) {
      const response = await api.post('/login', { email, password, remember_me });
      const token = response.data.access_token;
      this.token = token;

      if (remember_me) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }

      await this.fetchMe();
    },
    async fetchMe() {
      if (!this.token) return;
      try {
        const response = await api.get('/me');
        this.user = response.data;
      } catch (error) {
        console.error('failed to fetch user', error);
      }
    },
    async logout() {
      try {
        await api.post('/logout');
      } catch (error) {
        console.error('failed to do logout', error);
      } finally {
        this.token = null;
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    },
  },
});

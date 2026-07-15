import { defineStore } from 'pinia';
import { ref } from 'vue';

import api from '@/services/api';

export type Role = {
  id: number;
  name: string;
};

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([]);

  async function fetchRoles() {
    if (roles.value.length) return;
    const response = await api.get('roles');
    roles.value = response.data.data;
  }

  return { roles, fetchRoles };
});

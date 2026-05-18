import { defineStore } from 'pinia';
import { ref } from 'vue';

import api from '@/services/api';

type Role = {
  id: number;
  role: string;
};

export const useRoleStore = defineStore('role', () => {
  const roles = ref<Role[]>([]);

  async function fetchRoles() {
    if (roles.value.length) return;
    const response = await api.get('roles');
    console.log(response.data.data);
    roles.value = response.data;
  }

  return { roles, fetchRoles };
});

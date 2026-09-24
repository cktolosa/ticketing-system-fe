import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { User } from '@/modules/users';
import api from '@/services/api';

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);

  async function fetchUsers() {
    if (users.value.length) return;
    const response = await api.get('users');
    users.value = response.data.data;
  }

  return { users, fetchUsers };
});

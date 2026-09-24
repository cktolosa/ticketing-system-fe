import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Priority } from '@/modules/tickets';
import api from '@/services/api';

export const usePriorityStore = defineStore('priority', () => {
  const priorities = ref<Priority[]>([]);

  async function fetchPriorities() {
    if (priorities.value.length) return;
    const response = await api.get('priorities');
    priorities.value = response.data.data;
  }

  return { priorities, fetchPriorities };
});

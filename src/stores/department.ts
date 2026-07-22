import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Department } from '@/modules/departments/types';
import api from '@/services/api';

export const useDepartmentStore = defineStore('department', () => {
  const departments = ref<Department[]>([]);

  async function fetchDepartments() {
    if (departments.value.length) return;
    const response = await api.get('departments');
    departments.value = response.data.data;
  }

  async function fetchDepartmentbyId(departmentId: string) {
    const response = await api.get(`departments/${departmentId}`);
    return response.data.data;
  }

  return { departments, fetchDepartments, fetchDepartmentbyId };
});

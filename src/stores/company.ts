import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Company } from '@/modules/companies/types';
import api from '@/services/api';

export const useCompanyStore = defineStore('company', () => {
  const companies = ref<Company[]>([]);

  async function fetchCompanies() {
    if (companies.value.length) return;
    const response = await api.get('companies');
    companies.value = response.data.data;
  }

  async function fetchCompanybyId(companyId: string) {
    const response = await api.get(`companies/${companyId}`);
    return response.data.data;
  }

  return { companies, fetchCompanies, fetchCompanybyId };
});

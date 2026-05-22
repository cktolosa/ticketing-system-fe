import type { Company } from '@/modules/companies/types';
import api from '@/services/api';

export const companiesApi = {
  getAll: async () => {
    const response = await api.get<{ data: Company[] }>('/companies');
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: Company }>(`/companies/${id}`);
    return response.data.data;
  },
  create: async (name: string) => {
    const response = await api.post<{ data: Company }>('/companies', { name });
    return response.data.data;
  },
  update: async (id: string, name: string) => {
    const response = await api.put<{ data: Company }>(`/companies/${id}`, { name });
    return response.data.data;
  },
};

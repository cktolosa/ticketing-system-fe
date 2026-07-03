import type { Company } from '@/modules/companies';
import api from '@/services/api';

export const companiesApi = {
  create: async (name: string) => {
    const response = await api.post<{ data: Company }>('/companies', { name });
    return response.data.data;
  },
  update: async (id: string, name: string) => {
    const response = await api.put<{ data: Company }>(`/companies/${id}`, { name });
    return response.data.data;
  },
};

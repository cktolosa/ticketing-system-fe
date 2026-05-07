import type { Department } from "@/modules/departments/types'";
import api from '@/services/api';

export const departmentsApi = {
  // returns null values
  getById: async (id: string) => {
    const response = await api.get<{ data: Department }>(`/departments/${id}`);
    return response.data.data;
  },
  create: async (company_id: string, name: string) => {
    const response = await api.post<{ data: Department }>('/departments', { company_id, name });
    return response.data.data;
  },
  // still need to check
  update: async (id: string, company_id: string, name: string) => {
    const response = await api.put<{ data: Department }>(`/departments/${id}`, {
      company_id,
      name,
    });
    return response.data.data;
  },
};

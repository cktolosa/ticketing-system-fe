import type { Department } from "@/modules/departments/types'";
import api from '@/services/api';

export const departmentsApi = {
  // column name mismatch
  create: async (company_id: string, category: string) => {
    const response = await api.post<{ data: Department }>('/departments', { company_id, category });
    return response.data.data;
  },
};

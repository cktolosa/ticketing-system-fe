import type { Department, DepartmentPayload } from "@/modules/departments/types'";
import api from '@/services/api';

export const departmentsApi = {
  getById: async (id: string) => {
    const response = await api.get<{ data: Department }>(`/departments/${id}`);
    return response.data.data;
  },
  create: async (company_id: string, name: string) => {
    const response = await api.post<{ data: DepartmentPayload }>('/departments', {
      company_id,
      name,
    });
    return response.data.data;
  },
  update: async (id: string, company_id: string, name: string) => {
    const response = await api.put<{ data: DepartmentPayload }>(`/departments/${id}`, {
      company_id,
      name,
    });
    return response.data.data;
  },
};

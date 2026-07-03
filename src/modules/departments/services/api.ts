import type { Department, DepartmentPayload } from '@/modules/departments';
import api from '@/services/api';

export const departmentsApi = {
  getById: async (id: string) => {
    const response = await api.get<{ data: Department }>(`/departments/${id}`);
    return response.data.data;
  },
  create: async (data: DepartmentPayload) => {
    const response = await api.post<{ data: Department }>('/departments', data);
    return response.data.data;
  },
  update: async (id: string, data: DepartmentPayload) => {
    const response = await api.put<{ data: Department }>(`/departments/${id}`, data);
    return response.data.data;
  },
};

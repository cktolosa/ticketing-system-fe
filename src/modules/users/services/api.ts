import api from '@/services/api';

import type { User } from '../types';

export const usersApi = {
  getAll: async () => {
    const response = await api.get<{ data: User[] }>('/users');
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  },
  // create: async (company_id: string, name: string) => {
  //   const response = await api.post<{ data: User }>('/users', { company_id, name });
  //   return response.data.data;
  // },
  // update: async (id: string, company_id: string, name: string) => {
  //   const response = await api.put<{ data: User }>(`/users/${id}`, {
  //     company_id,
  //     name,
  //   });
  //   return response.data.data;
  // },
};

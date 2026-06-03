import api from '@/services/api';

import type { User, UserPayload } from '../types';

const userFormData = (data: Partial<UserPayload>, method: 'POST' | 'PUT' = 'POST'): FormData => {
  const formData = new FormData();
  if (method === 'PUT') formData.append('_method', 'PUT');
  if (data.avatar) formData.append('avatar', data.avatar);
  if (data.name) formData.append('name', data.name);
  if (data.email) formData.append('email', data.email);
  if (data.password) formData.append('password', data.password);
  if (data.company_id) formData.append('company_id', String(data.company_id));
  if (data.department_id) formData.append('department_id', String(data.department_id));
  if (data.role_id) formData.append('role_id', String(data.role_id));
  if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');
  return formData;
};

export const usersApi = {
  getAll: async () => {
    const response = await api.get<{ data: User[] }>('/users');
    return response.data.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: User }>(`/users/${id}`);
    return response.data.data;
  },
  create: async (data: UserPayload) => {
    const response = await api.post<{ data: User }>('/users', userFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
  update: async (id: string, data: UserPayload) => {
    const response = await api.post<{ data: User }>(`/users/${id}`, userFormData(data, 'PUT'), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

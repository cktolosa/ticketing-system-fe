import type { Meta } from '@/modules/types';
import api from '@/services/api';

import type { Faq, FaqPayload } from '../types';

export const faqsApi = {
  getAll: async (page = 1) => {
    const response = await api.get<{ data: Faq[]; meta: Meta }>('/articles', {
      params: { page },
    });
    return response.data;
  },
  getByUser: async (page = 1) => {
    const response = await api.get<{ data: Faq[]; meta: Meta }>('/articles/my', {
      params: { page },
    });
    return response.data;
  },
  getByDepartment: async (page = 1) => {
    const response = await api.get<{ data: Faq[]; meta: Meta }>('/articles/department', {
      params: { page },
    });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: Faq }>(`/articles/${id}`);
    return response.data.data;
  },
  create: async (data: { title: string; content: string; content_text: string }) => {
    const response = await api.post<{ data: FaqPayload }>('/articles', data);
    return response.data.data;
  },
  update: async (id: string, data: { title: string; content: string; content_text: string }) => {
    const response = await api.put<{ data: FaqPayload }>(`/articles/${id}`, data);
    return response.data.data;
  },
};

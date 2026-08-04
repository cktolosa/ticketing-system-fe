import type { Meta } from '@/modules/types';
import api from '@/services/api';

import type { Ticket, TicketPayload } from '../types';

const ticketFormData = (data: Partial<TicketPayload>): FormData => {
  const formData = new FormData();
  // need to add attachments
  if (data.user_id) formData.append('user_id', String(data.user_id));
  if (data.department_id) formData.append('department_id', String(data.department_id));
  if (data.priority_id) formData.append('priority_id', String(data.priority_id));
  if (data.employee_id) formData.append('employee_id', String(data.employee_id));
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  return formData;
};

export const ticketsApi = {
  getAll: async (page = 1) => {
    const response = await api.get<{ data: Ticket[]; meta: Meta }>('/tickets', {
      params: { page, filter: 'all' },
    });
    return response.data;
  },
  getByDepartment: async (page = 1) => {
    const response = await api.get<{ data: Ticket[]; meta: Meta }>('/tickets', {
      params: { page, filter: 'department' },
    });
    return response.data;
  },
  getAssigned: async (page = 1) => {
    const response = await api.get<{ data: Ticket[]; meta: Meta }>('/tickets', {
      params: { page, filter: 'assigned' },
    });
    return response.data;
  },
  getFiled: async (page = 1) => {
    const response = await api.get<{ data: Ticket[]; meta: Meta }>('/tickets', {
      params: { page, filter: 'filed' },
    });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<{ data: Ticket }>(`/tickets/${id}`);
    return response.data.data;
  },
  create: async (data: TicketPayload) => {
    const response = await api.post<{ data: Ticket }>('/tickets', ticketFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

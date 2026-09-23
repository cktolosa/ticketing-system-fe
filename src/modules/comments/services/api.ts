import api from '@/services/api';

import type { Comment, CommentPayload } from '../types';

const commentFormData = (data: Partial<CommentPayload>): FormData => {
  const formData = new FormData();
  if (data.photo?.[0]) formData.append('photo', data.photo[0]);
  if (data.comment) formData.append('comment', data.comment);

  return formData;
};

export const commentsApi = {
  create: async (ticketId: string, data: CommentPayload) => {
    const response = await api.post<{ data: Comment }>(
      `/tickets/${ticketId}/comments`,
      commentFormData(data),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data.data;
  },
  //need to update to match BE's controller
  update: async (ticketId: string, id: number, data: { comment: string }) => {
    const response = await api.put<{ data: Comment }>(`/tickets/${ticketId}/comments/${id}`, data);
    return response.data.data;
  },
};

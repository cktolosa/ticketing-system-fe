import api from '@/services/api';

import type { Comment, CommentPayload } from '../types';

const commentFormData = (data: Partial<CommentPayload>): FormData => {
  const formData = new FormData();
  if (data.photo) formData.append('photo', data.photo);
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
};

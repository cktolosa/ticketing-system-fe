import api from '@/services/api';

import type { Avatar } from '../types';

export type ProfilePayload = {
  avatar?: File;
};

const avatarFormData = (data: ProfilePayload): FormData => {
  const formData = new FormData();
  if (data.avatar) formData.append('avatar', data.avatar);
  return formData;
};

export const profileApi = {
  update: async (data: ProfilePayload) => {
    const response = await api.post<{ data: Avatar }>(`/profile`, avatarFormData(data), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data;
  },
};

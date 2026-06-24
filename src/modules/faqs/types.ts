import type { Department } from '../departments/types';
import type { User } from '../users/types';

export type FaqPayload = {
  user_id: number;
  department_id: number;
  title: string;
  content: string;
};

export type Faq = {
  id: number;
  updated_at: Date;
  author: User;
  title: string;
  content: string;
  department_id: Department;
  faq_views: number;
};

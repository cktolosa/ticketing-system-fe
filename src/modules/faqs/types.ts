import type { Department } from '@/modules/departments';
import type { User } from '@/modules/users';

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
  department: Department;
  faq_views: number;
};

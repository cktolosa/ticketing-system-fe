import type { Department } from '@/modules/departments';
import type { User } from '@/modules/users';

export type Attachment = {
  filename: string;
  size: string;
};

export type Status = {
  id: number;
  category: string;
};

export type Priority = {
  id: number;
  category: string;
};

export type Comment = {
  id: number;
  user: User;
  updated_at: Date;
  comment: string;
  attachment?: Attachment;
};

export type Ticket = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  department: Department;
  status: Status;
  priority: Priority;
  user: User;
  employee: User;
  histories: History[];
  comments: Comment[];
  attachments: Attachment[];
};

export type TicketPayload = {
  attachments?: File[];
  title: string;
  description: string;
  department_id: number;
  user_id?: number;
  employee_id?: number;
  priority_id: number;
};

export type History = {
  description: string;
  timestamp: Date;
};

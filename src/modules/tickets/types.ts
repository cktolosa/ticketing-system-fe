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
  author: string;
  timestamp: Date;
  comment: string;
  attachments?: Attachment[];
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
  admin: User;
  histories: History;
  attachment: Attachment;
};

export type TicketPayload = {
  // need to add attachments
  title: string;
  description: string;
  department_id: number;
  employee_id?: number;
  admin_id?: number;
  priority_id: number;
};

export type History = {
  description: string;
  timestamp: Date;
};

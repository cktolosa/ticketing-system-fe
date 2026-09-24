import type { Attachment } from '@/modules/tickets';
import type { User } from '@/modules/users';

export type CommentPayload = {
  comment: string;
  photo?: File[];
};

export type Comment = {
  id: number;
  user: User;
  updated_at: Date;
  comment: string;
  photo?: Attachment;
};
